import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, Image, ScrollView, Alert, Vibration } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Importações dos Sensores do Expo
import { Pedometer } from 'expo-sensors';
import * as Location from 'expo-location';
import { Camera } from 'expo-camera';

// --- CORES DO TEMA ESCURO ---
const colors = {
  background: '#121214',
  card: '#1D1D2E',
  text: '#FFFFFF',
  subText: '#98A2B3',
  border: '#2D2D44',
  purple: '#7F56D9',
  timerBg: '#121214',
  progressBg: '#2D2D44',
};

// --- DADOS MOCADOS ---
const EXERCICIOS = [
  { id: '1', categoria: 'Cardio', nome: 'Corrida Estacionária', instrucao: 'Corra no lugar elevando os joelhos a 90 graus. Mantenha o abdômen contraído.', duracao: '10 min', imagem: 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=150' },
  { id: '2', categoria: 'Cardio', nome: 'Polichinelos', instrucao: 'Salte abrindo as pernas e elevando os braços acima da cabeça simultaneamente.', duracao: '5 min', imagem: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=150' },
  { id: '3', categoria: 'Força', nome: 'Agachamento Livre', instrucao: 'Afaste os pés na largura dos ombros e desça o quadril como se fosse sentar em uma cadeira.', duracao: '3 séries de 15', imagem: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=150' },
  { id: '4', categoria: 'Força', nome: 'Flexão de Braço', instrucao: 'Mantenha o corpo alinhado da cabeça aos calcanhares. Flexione os braços até o peito quase tocar o chão.', duracao: '3 séries de 12', imagem: 'https://images.unsplash.com/photo-1598971639058-fab3c3109a00?w=150' },
  { id: '5', categoria: 'Força', nome: 'Afundo / Passada', instrucao: 'Dê um passo à frente e flexione o joelho de trás em direção ao chão formando um ângulo de 90º.', duracao: '3 séries de 10', imagem: 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?w=150' },
  { id: '6', categoria: 'Funcional', nome: 'Prancha Abdominal', instrucao: 'Apoie os antebraços no chão e mantenha o corpo reto e rígido como uma tábua.', duracao: '3 de 45 seg', imagem: 'https://images.unsplash.com/photo-1518310383802-640c2de311b2?w=150' },
  { id: '7', categoria: 'Funcional', nome: 'Burpee', instrucao: 'Agache, jogue os pés para trás em posição de flexão, volte ao agachamento e salte para cima.', duracao: '3 séries de 10', imagem: 'https://images.unsplash.com/photo-1544033527-b192daee1f5b?w=150' },
  { id: '8', categoria: 'Funcional', nome: 'Abdominal Supra', instrucao: 'Deite de costas, flexione os joelhos e contraia o abdômen tirando as escápulas do chão.', duracao: '4 séries de 20', imagem: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=150' },
  { id: '9', categoria: 'Alongamento', nome: 'Alongamento Isquiotibiais', instrucao: 'Sente-se no chão com as pernas esticadas e tente tocar a ponta dos pés com as mãos.', duracao: '2 min', imagem: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=150' },
  { id: '10', categoria: 'Alongamento', nome: 'Alongamento de Quadríceps', instrucao: 'Em pé, puxe o calcanhar em direção ao glúteo e segure mantendo os joelhos alinhados.', duracao: '1 min cada perna', imagem: 'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=150' },
];

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName="Home"
        screenOptions={{
          headerStyle: { 
            backgroundColor: '#1A1A2E', 
            borderBottomWidth: 1, 
            borderBottomColor: '#2D2D44',
          },
          headerTintColor: '#FFF',
          headerTitleStyle: { fontWeight: '800', fontSize: 18, letterSpacing: 0.5 },
          contentStyle: { backgroundColor: '#121214' },
        }}
      >
        <Stack.Screen 
          name="Home" 
          component={HomeScreen} 
          options={({ navigation }) => ({ 
            title: 'FitLife',
            headerRight: () => (
              <TouchableOpacity 
                onPress={() => navigation.navigate('SobreNos')} 
                style={{ marginRight: 15 }}
              >
                <Text style={{ color: '#FFF', fontWeight: 'bold', fontSize: 14 }}>Sobre Nós</Text>
              </TouchableOpacity>
            )
          })} 
        />
        <Stack.Screen name="ListarExercicios" component={ListarExerciciosScreen} options={{ title: 'Exercícios' }} />
        <Stack.Screen name="Detalhes" component={DetalhesScreen} options={{ title: 'Instruções do Treino' }} />
        <Stack.Screen name="Perfil" component={PerfilScreen} options={{ title: 'Meu Perfil & Sensores' }} />
        <Stack.Screen name="SobreNos" component={SobreNosScreen} options={{ title: 'Sobre o projeto' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

// --- 1. TELA INICIAL ---
function HomeScreen({ navigation }) {
  const categorias = [
    { nome: 'Todos', emoji: '⚡' },
    { nome: 'Cardio', emoji: '🫀' },
    { nome: 'Força', emoji: '💪' },
    { nome: 'Funcional', emoji: '🤸' },
    { nome: 'Alongamento', emoji: '🧘' }
  ];

  return (
    <ScrollView style={[styles.containerScroll, { backgroundColor: colors.background }]}>
      <View style={styles.headerHome}>
        <Text style={[styles.boasVindas, { color: colors.text }]}>Bem vindo 👋</Text>
      </View>
      
      <View style={styles.conteudoHome}>
        <Text style={[styles.tituloSecao, { color: colors.text }]}>Selecione uma Categoria</Text>
        
        <View style={styles.listaCategoriasLonga}>
          {categorias.map((cat, index) => (
            <TouchableOpacity 
              key={index} 
              style={[styles.botaoLargo, { backgroundColor: colors.purple, marginBottom: 12 }]} 
              onPress={() => navigation.navigate('ListarExercicios', { categoriaSelecionada: cat.nome })}
              activeOpacity={0.8}
            >
              <Text style={styles.textoBotaoLargo}>{cat.emoji}  {cat.nome}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={[styles.divisor, { backgroundColor: colors.border }]} />

        <TouchableOpacity 
          style={[styles.botaoLargo, { backgroundColor: colors.purple }]} 
          onPress={() => navigation.navigate('Perfil')}
          activeOpacity={0.9}
        >
          <Text style={styles.textoBotaoLargo}>📊  Acessar Monitoramento & Sensores</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

// --- 2. TELA DE LISTAGEM ---
function ListarExerciciosScreen({ route, navigation }) {
  const { categoriaSelecionada } = route.params;

  const dadosFiltrados = categoriaSelecionada === 'Todos' 
    ? EXERCICIOS 
    : EXERCICIOS.filter(item => item.categoria === categoriaSelecionada);

  const renderItem = ({ item }) => {
    const obterCorCategoria = (cat) => {
      switch (cat) {
        case 'Cardio': return '#FF5A5F';
        case 'Força': return '#FFB400';
        case 'Funcional': return '#00E676';
        case 'Alongamento': return '#00B0FF';
        default: return '#7F56D9';
      }
    };

    return (
      <TouchableOpacity 
        style={[styles.cardExercicio, { backgroundColor: colors.card, borderColor: colors.border }]}
        onPress={() => navigation.navigate('Detalhes', { exercicio: item })}
        activeOpacity={0.8}
      >
        <Image source={{ uri: item.imagem }} style={styles.imagemCard} />
        <View style={styles.infoCard}>
          <Text style={[styles.nomeExercicio, { color: colors.text }]}>{item.nome}</Text>
          <View style={styles.linhaInfoCard}>
            <View style={[styles.badgeCategoria, { backgroundColor: obterCorCategoria(item.categoria) }]}>
              <Text style={styles.textoBadgeCategoria}>{item.categoria}</Text>
            </View>
            <Text style={[styles.duracaoExercicio, { color: colors.subText }]}>⏱️ {item.duracao}</Text>
          </View>
        </View>
        <View style={styles.setaCard}>
          <Text style={[styles.textoSetaCard, { color: colors.subText }]}>➔</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.tituloSecao, { color: colors.text }]}>Treinos de {categoriaSelecionada}</Text>
      <FlatList
        data={dadosFiltrados}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  );
}

// --- 3. TELA DE DETALHES (CRONÔMETRO AUTOMÁTICO) ---
function DetalhesScreen({ route, navigation }) {
  const { exercicio } = route.params;

  const obterTotalSeries = (duracao) => {
    const match = duracao.match(/(\d+)\s*(série|de)/i);
    if (match) return parseInt(match[1], 10);
    if (duracao.includes('min') || duracao.includes('seg')) return 1;
    return 3;
  };

  const obterTempoExercicio = (duracao) => {
    const matchSeg = duracao.match(/(\d+)\s*(seg|s)/i);
    if (matchSeg) return parseInt(matchSeg[1], 10);
    const matchMin = duracao.match(/(\d+)\s*(min|m)/i);
    if (matchMin && !duracao.includes('série') && !duracao.includes('de'))
      return parseInt(matchMin[1], 10) * 60;
    return 30;
  };

  const totalSeries = obterTotalSeries(exercicio.duracao);
  const totalSegundosSerie = obterTempoExercicio(exercicio.duracao);

  const seriesRef = useRef(0);

  const [seriesConcluidas, setSeriesConcluidas] = useState(0);
  const [tempoRestante, setTempoRestante] = useState(totalSegundosSerie);
  const [cronometroAtivo, setCronometroAtivo] = useState(false);
  const [mensagemFinal, setMensagemFinal] = useState(false);

  useEffect(() => {
    seriesRef.current = seriesConcluidas;
  }, [seriesConcluidas]);

  useEffect(() => {
    setTempoRestante(totalSegundosSerie);
    setSeriesConcluidas(0);
    seriesRef.current = 0;
    setCronometroAtivo(false);
    setMensagemFinal(false);
  }, [exercicio]);

  // Efeito do Cronômetro
  useEffect(() => {
    let intervalo = null;
    if (cronometroAtivo && tempoRestante > 0) {
      intervalo = setInterval(() => {
        setTempoRestante(prev => prev - 1);
      }, 1000);
    } else if (tempoRestante === 0 && cronometroAtivo) {
      const proximaSerie = seriesRef.current + 1;
      setSeriesConcluidas(proximaSerie);
      seriesRef.current = proximaSerie;

      if (proximaSerie >= totalSeries) {
        // === ÚLTIMA SÉRIE ===
        try { Vibration.vibrate([0, 400, 200, 400]); } catch (e) {}
        setCronometroAtivo(false);
        setMensagemFinal(true);
      } else {
        // === SÉRIE INTERMEDIÁRIA - avança automaticamente ===
        try { Vibration.vibrate(200); } catch (e) {}
        setTempoRestante(totalSegundosSerie);
      }
    }
    return () => clearInterval(intervalo);
  }, [cronometroAtivo, tempoRestante]);

  const alternarCronometro = () => {
    if (seriesConcluidas >= totalSeries) {
      Alert.alert("Exercício Concluído", "Zere o cronômetro para iniciar novamente.");
      return;
    }
    setCronometroAtivo(!cronometroAtivo);
  };

  const zerarCronometro = () => {
    setCronometroAtivo(false);
    setTempoRestante(totalSegundosSerie);
    setSeriesConcluidas(0);
    seriesRef.current = 0;
    setMensagemFinal(false);
    try { Vibration.vibrate(100); } catch (e) {}
  };

  const formatarTempo = (segundos) => {
    const mins = Math.floor(segundos / 60);
    const segs = segundos % 60;
    return `${mins.toString().padStart(2, '0')}:${segs.toString().padStart(2, '0')}`;
  };

  const porcentagemProgresso = totalSegundosSerie > 0 ? (tempoRestante / totalSegundosSerie) * 100 : 0;

  return (
    <ScrollView style={[styles.containerScroll, { backgroundColor: colors.background }]}>
      <View style={styles.containerImagemDetalhe}>
        <Image source={{ uri: exercicio.imagem }} style={styles.imagemDetalhe} />
        <View style={styles.overlayImagem} />
      </View>
      
      <View style={[styles.conteudoDetalhe, { backgroundColor: colors.background }]}>
        <Text style={[styles.tituloDetalhe, { color: colors.text }]}>{exercicio.nome}</Text>
        
        <View style={styles.linhaDetalheMetadados}>
          <Text style={[styles.categoriaDetalheBadge, { backgroundColor: colors.border, color: colors.text }]}>{exercicio.categoria}</Text>
          <Text style={[styles.duracaoDetalheBadge, { color: colors.subText }]}>⏱️ {exercicio.duracao}</Text>
        </View>
        
        {/* Painel do Cronômetro */}
        <View style={[styles.cardContador, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.statusContadorContainer}>
            <Text style={[styles.tituloContador, { color: colors.subText }]}>Cronômetro de Séries</Text>
            
            {seriesConcluidas >= totalSeries ? (
              <View style={styles.badgeConcluido}>
                <Text style={styles.textoBadgeConcluido}>Concluído! 🎉</Text>
              </View>
            ) : (
              <Text style={[styles.statusContadorText, { color: colors.subText }]}>
                Série: <Text style={styles.destaqueContador}>{seriesConcluidas + 1}</Text> de {totalSeries}
              </Text>
            )}
          </View>

          <View style={[styles.timerDisplayContainer, { backgroundColor: colors.timerBg, borderColor: colors.border }]}>
            <Text style={[styles.timerDisplayText, { color: colors.text }]}>
              {formatarTempo(tempoRestante)}
            </Text>
            
            <View style={[styles.barraProgressoFundo, { backgroundColor: colors.progressBg }]}>
              <View style={[styles.barraProgressoPreenchida, { width: `${porcentagemProgresso}%`, backgroundColor: colors.purple }]} />
            </View>

            <Text style={[styles.timerDisplaySubtitle, { color: colors.subText }]}>
              {mensagemFinal ? '✅ Finalizado' : cronometroAtivo ? '💪 Executando...' : '⏸️ Pausado'}
            </Text>
          </View>

          {/* Indicador de Bolinhas */}
          <View style={styles.indicadoresContainer}>
            {Array.from({ length: totalSeries }).map((_, index) => (
              <View 
                key={index} 
                style={[
                  styles.circuloIndicador, 
                  index < seriesConcluidas ? styles.circuloAtivo : [styles.circuloInativo, { backgroundColor: colors.border }]
                ]}
              />
            ))}
          </View>

          {/* Mensagem de conclusão */}
          {mensagemFinal && (
            <View style={styles.mensagemFinalContainer}>
              <Text style={styles.mensagemFinalTexto}>
                🎉 Parabéns! Todas as {totalSeries} séries de "{exercicio.nome}" foram concluídas!
              </Text>
            </View>
          )}

          {/* Botões */}
          <View style={styles.linhaBotoesContadorVertical}>
            <TouchableOpacity 
              style={[
                styles.botaoLargo, 
                cronometroAtivo ? styles.botaoPausar : { backgroundColor: colors.purple },
                seriesConcluidas >= totalSeries ? styles.botaoDesabilitado : {}
              ]} 
              onPress={alternarCronometro}
              disabled={seriesConcluidas >= totalSeries}
              activeOpacity={0.8}
            >
              <Text style={styles.textoBotaoLargo}>
                {seriesConcluidas >= totalSeries 
                  ? 'Treino Concluído' 
                  : cronometroAtivo 
                    ? 'Pausar' 
                    : seriesConcluidas === 0 
                      ? 'Iniciar Treino' 
                      : 'Retomar Série ' + (seriesConcluidas + 1)}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.botaoLargo, { backgroundColor: colors.border, marginTop: 10 }]} 
              onPress={zerarCronometro} 
              activeOpacity={0.8}
            >
              <Text style={[styles.textoBotaoLargo, { color: colors.text }]}>Zerar Cronômetro</Text>
            </TouchableOpacity>
          </View>
        </View>

        <Text style={[styles.tituloInstrucoes, { color: colors.text }]}>Como Executar:</Text>
        <View style={[styles.cardInstrucoes, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.textoInstrucoes, { color: colors.text }]}>{exercicio.instrucao}</Text>
        </View>

        <TouchableOpacity 
          style={[styles.botaoVoltarCustom, { backgroundColor: colors.card, borderColor: colors.border }]} 
          onPress={() => navigation.goBack()} 
          activeOpacity={0.8}
        >
          <Text style={[styles.textoBotaoVoltarCustom, { color: colors.text }]}>Voltar para Lista</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

// --- 4. TELA DE PERFIL / SENSORES ---
function PerfilScreen() {
  const [passosAtuais, setPassosAtuais] = useState(0);
  const [pedometroDisponivel, setPedometroDisponivel] = useState('verificando');
  const [localizacao, setLocalizacao] = useState(null);
  const [statusLocalizacao, setStatusLocalizacao] = useState('Não Iniciado');
  const [statusCamera, setStatusCamera] = useState(null);
  const [fotoRegistrada, setFotoRegistrada] = useState(null);

  useEffect(() => {
    Pedometer.isAvailableAsync().then(
      result => { setPedometroDisponivel(String(result)); },
      error => { setPedometroDisponivel('Não suportado no emulador'); }
    );

    const subscription = Pedometer.watchStepCount(result => {
      setPassosAtuais(result.steps);
    });

    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setStatusCamera(status === 'granted');
    })();

    return () => subscription && subscription.remove();
  }, []);

  const rastrearCorridaGps = async () => {
    setStatusLocalizacao('Buscando sinal GPS...');
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permissão negada', 'Precisamos de acesso ao GPS para rastrear sua corrida.');
      setStatusLocalizacao('Permissão Negada');
      return;
    }

    let location = await Location.getCurrentPositionAsync({});
    setLocalizacao(location);
    setStatusLocalizacao('Corrida Rastreada com Sucesso!');
  };

  const tirarFotoProgresso = () => {
    if (!statusCamera) {
      Alert.alert("Permissão necessária", "Ative a permissão de câmera do dispositivo.");
      return;
    }
    setFotoRegistrada('https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=300');
    Alert.alert("Sucesso", "Foto de progresso registrada!");
  };

  return (
    <ScrollView style={[styles.containerScroll, { backgroundColor: colors.background }]}>
      <View style={[styles.cardSensor, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <Text style={[styles.tituloCardSensor, { color: colors.text }]}>🏃♂️ Acelerômetro (Passos da Sessão)</Text>
        <Text style={[styles.sensorValor, { color: colors.text }]}>Passos Detectados: {passosAtuais}</Text>
        <Text style={[styles.legendaSensor, { color: colors.subText }]}>Status do Sensor: {pedometroDisponivel}</Text>
      </View>

      <View style={[styles.cardSensor, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <Text style={[styles.tituloCardSensor, { color: colors.text }]}>📍 Rastreamento de Corrida (GPS)</Text>
        <Text style={[styles.sensorValor, { color: colors.text }]}>Status: {statusLocalizacao}</Text>
        {localizacao && (
          <View style={[styles.boxGps, { backgroundColor: colors.background, borderColor: colors.border }]}>
            <Text style={[styles.textoGps, { color: colors.purple }]}>Latitude: {localizacao.coords.latitude}</Text>
            <Text style={[styles.textoGps, { color: colors.purple }]}>Longitude: {localizacao.coords.longitude}</Text>
            <Text style={[styles.textoGps, { color: colors.purple }]}>Precisão: {localizacao.coords.accuracy} metros</Text>
          </View>
        )}
        <TouchableOpacity 
          style={[styles.botaoLargo, { backgroundColor: colors.purple, marginTop: 10 }]} 
          onPress={rastrearCorridaGps} 
          activeOpacity={0.8}
        >
          <Text style={styles.textoBotaoLargo}>Ativar GPS / Iniciar Corrida</Text>
        </TouchableOpacity>
      </View>

      <View style={[styles.cardSensor, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <Text style={[styles.tituloCardSensor, { color: colors.text }]}>📸 Registro de Progresso (Câmera)</Text>
        <TouchableOpacity 
          style={[styles.botaoLargo, { backgroundColor: colors.purple, marginTop: 10 }]} 
          onPress={tirarFotoProgresso} 
          activeOpacity={0.8}
        >
          <Text style={styles.textoBotaoLargo}>Tirar Foto do Meu Progresso</Text>
        </TouchableOpacity>
        {fotoRegistrada && (
          <View style={{ alignItems: 'center', marginTop: 14 }}>
            <Text style={{ marginBottom: 8, fontStyle: 'italic', color: colors.subText }}>Visualização do seu progresso:</Text>
            <Image source={{ uri: fotoRegistrada }} style={styles.previewFoto} />
          </View>
        )}
      </View>
    </ScrollView>
  );
}

// --- 5. TELA SOBRE NÓS ---
function SobreNosScreen({ navigation }) {
  return (
    <View style={[styles.container, { backgroundColor: colors.background, padding: 20 }]}>
      <Text style={[styles.tituloSecao, { color: colors.text }]}>Sobre Nós</Text>
      
      <View style={[styles.cardSensor, { backgroundColor: colors.card, borderColor: colors.border, marginHorizontal: 0, padding: 18 }]}>
        <Text style={[styles.tituloCardSensor, { color: colors.text, fontSize: 18 }]}>FitLife</Text>
        <Text style={[styles.legendaSensor, { color: colors.subText, fontSize: 14, lineHeight: 22 }]}>
          Projeto para a disciplina mobile coding apresentando o app "FitLife".
        </Text>
        <Text style={[styles.legendaSensor, { color: colors.subText, marginTop: 20, fontWeight: '700' }]}>
          Versão: 1.0.0 (Snack Web build)
        </Text>
      </View>

      <TouchableOpacity 
        style={[styles.botaoLargo, { backgroundColor: colors.purple, marginTop: 24 }]} 
        onPress={() => navigation.goBack()}
        activeOpacity={0.8}
      >
        <Text style={styles.textoBotaoLargo}>Voltar</Text>
      </TouchableOpacity>
    </View>
  );
}

// --- ESTILIZAÇÃO COMPLETA ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  containerScroll: {
    flex: 1,
  },
  headerHome: {
    paddingHorizontal: 4,
    paddingTop: 16,
    paddingBottom: 16,
  },
  boasVindas: {
    fontSize: 26,
    fontWeight: '800',
  },
  tituloSecao: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 16,
    marginTop: 8,
  },
  listaCategoriasLonga: {
    width: '100%',
  },
  divisor: {
    height: 1,
    marginVertical: 24,
  },
  botaoLargo: {
    flexDirection: 'row',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    elevation: 3,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    width: '100%',
  },
  textoBotaoLargo: {
    color: '#FFF',
    fontWeight: '800',
    fontSize: 16,
  },
  cardExercicio: {
    flexDirection: 'row',
    borderRadius: 12,
    marginBottom: 12,
    overflow: 'hidden',
    borderWidth: 1,
    alignItems: 'center',
  },
  imagemCard: {
    width: 80,
    height: 80,
  },
  infoCard: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
    justifyContent: 'center',
  },
  nomeExercicio: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 6,
  },
  linhaInfoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  badgeCategoria: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  textoBadgeCategoria: {
    color: '#FFF',
    fontSize: 11,
    fontWeight: '700',
  },
  duracaoExercicio: {
    fontSize: 12,
  },
  setaCard: {
    paddingRight: 16,
  },
  textoSetaCard: {
    fontSize: 16,
  },
  containerImagemDetalhe: {
    position: 'relative',
    width: '100%',
    height: 240,
  },
  imagemDetalhe: {
    width: '100%',
    height: '100%',
  },
  overlayImagem: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(18, 18, 20, 0.4)',
  },
  conteudoDetalhe: {
    padding: 18,
    marginTop: -24,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  tituloDetalhe: {
    fontSize: 24,
    fontWeight: '800',
  },
  linhaDetalheMetadados: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 8,
    marginBottom: 16,
  },
  categoriaDetalheBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    fontSize: 12,
    fontWeight: '700',
  },
  duracaoDetalheBadge: {
    fontSize: 13,
    fontWeight: '600',
  },
  cardInstrucoes: {
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
  },
  tituloInstrucoes: {
    fontSize: 18,
    fontWeight: '700',
    marginTop: 20,
    marginBottom: 8,
  },
  textoInstrucoes: {
    fontSize: 15,
    lineHeight: 22,
  },
  botaoVoltarCustom: {
    borderWidth: 1,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 30,
  },
  textoBotaoVoltarCustom: {
    fontWeight: '700',
    fontSize: 15,
  },
  cardContador: {
    borderRadius: 16,
    padding: 18,
    marginVertical: 12,
    borderWidth: 1,
  },
  tituloContador: {
    fontSize: 16,
    fontWeight: '700',
  },
  statusContadorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  statusContadorText: {
    fontSize: 14,
  },
  destaqueContador: {
    fontWeight: '800',
    fontSize: 16,
    color: '#03DAC6',
  },
  badgeConcluido: {
    backgroundColor: '#10B981',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  textoBadgeConcluido: {
    color: '#FFF',
    fontWeight: '800',
    fontSize: 11,
  },
  timerDisplayContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    paddingVertical: 20,
    marginVertical: 14,
    borderWidth: 1,
  },
  timerDisplayText: {
    fontSize: 52,
    fontWeight: '800',
    fontFamily: 'monospace',
    letterSpacing: 3,
  },
  timerDisplaySubtitle: {
    fontSize: 11,
    textTransform: 'uppercase',
    fontWeight: '700',
    letterSpacing: 1,
  },
  barraProgressoFundo: {
    height: 6,
    width: '75%',
    borderRadius: 3,
    marginTop: 12,
    marginBottom: 10,
    overflow: 'hidden',
  },
  barraProgressoPreenchida: {
    height: '100%',
    borderRadius: 3,
  },
  indicadoresContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 18,
    gap: 8,
  },
  circuloIndicador: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  circuloAtivo: {
    backgroundColor: '#03DAC6',
  },
  circuloInativo: {
    backgroundColor: '#2D2D44',
  },
  linhaBotoesContadorVertical: {
    flexDirection: 'column',
    width: '100%',
  },
  botaoPausar: {
    backgroundColor: '#EF4444',
  },
  botaoDesabilitado: {
    backgroundColor: '#2D2D44',
  },
  mensagemFinalContainer: {
    backgroundColor: '#10B981',
    borderRadius: 12,
    padding: 16,
    marginBottom: 14,
    alignItems: 'center',
  },
  mensagemFinalTexto: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
    lineHeight: 22,
  },
  cardSensor: {
    marginHorizontal: 16,
    marginTop: 16,
    padding: 18,
    borderRadius: 16,
    borderWidth: 1,
    elevation: 3,
  },
  tituloCardSensor: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 12,
  },
  sensorValor: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 6,
  },
  legendaSensor: {
    fontSize: 12,
  },
  boxGps: {
    padding: 10,
    borderRadius: 8,
    marginVertical: 12,
    borderWidth: 1,
  },
  textoGps: {
    fontSize: 12,
    fontFamily: 'monospace',
  },
  previewFoto: {
    width: '100%',
    height: 180,
    borderRadius: 12,
    marginTop: 10,
  },
});
