# FitLife ⚡

O **FitLife** é um aplicativo mobile desenvolvido em React Native e Expo focado na saúde, bem-estar e monitoramento físico dos usuários. O projeto traz uma interface moderna projetada para catalogar treinos diários divididos por categorias, cronometrar séries de exercícios de forma inteligente e coletar dados físicos e ambientais em tempo real integrando sensores nativos do dispositivo (Acelerômetro, GPS e Câmera).

Este projeto foi construído como parte dos requisitos práticos da disciplina de **Programação - Mobile Coding**.

---------------

## 📱 Telas do Aplicativo

O fluxo de navegação do aplicativo é gerenciado de forma nativa e estruturado em 5 telas principais:

1. **Início (Home):** Painel de boas-vindas com a listagem de categorias de exercícios (Cardio, Força, Funcional e Alongamento) e o botão de acesso rápido ao monitoramento.
2. **Listagem de Exercícios:** Exibe os treinos filtrados de acordo com a categoria escolhida. Cada item apresenta o nome, uma imagem ilustrativa, a classificação e o tempo estimado de duração.
3. **Instruções do Treino (Detalhes):** Fornece instruções detalhadas de como executar o movimento. Conta com um **Painel de Cronômetro Automático** que monitora as séries e emite alertas táteis (vibração) ao término de cada etapa.
4. **Meu Perfil & Sensores:** Central que expõe a integração de hardware do smartphone, lendo dados de passos, coordenadas geográficas e permitindo fotos de evolução física.
5. **Sobre o Projeto:** Detalhamento da equipe de desenvolvimento e informações da versão da build.

---------------

## 🛠️ Tecnologias e Dependências

O projeto utiliza o ecossistema moderno do React Native e Expo:

* **React (v19.1.0) & React Native (v0.81.5):** Core de desenvolvimento do app.
* **Expo SDK 54:** Framework para simplificação do desenvolvimento e build.
* **React Navigation Stack:** Gerenciamento de rotas nativas fluidas entre as telas.
* **React Native Paper:** Elementos de UI baseados em Material Design.

### 📡 Integração com Sensores Nativos

Para cumprir o escopo avançado de dispositivos móveis, o app se conecta diretamente com a API do hardware usando módulos específicos do Expo:

* **`expo-sensors` (Pedometer):** Utiliza o acelerômetro para contabilizar o número de passos do usuário de forma assíncrona durante a sessão.
* **`expo-location` (GPS):** Captura a latitude, longitude e precisão do posicionamento global do aparelho para o rastreamento de treinos de corrida externos.
* **`expo-camera`:** Gerencia as permissões de privacidade do sistema operacional e ativa o sensor ótico traseiro/frontal para o registro fotográfico do progresso físico.

---

## 🚀 Como Executar o Projeto

### Pré-requisitos
Antes de começar, certifique-se de ter instalado em sua máquina o **Node.js** e um gerenciador de pacotes (npm ou yarn). Você também precisará do aplicativo **Expo Go** instalado no seu celular (Android ou iOS) para testar os recursos físicos dos sensores.

### Passo a Passo

1. **Clonar o Repositório**
   ```bash
   git clone [https://github.com/KFelipe1M/Mobile_coding_project](https://github.com/KFelipe1M/Mobile_coding_project)
   cd Mobile_coding_project
Instalar as Dependências
No diretório raiz do projeto, instale os pacotes necessários:

Bash
npm install
# ou se usar yarn
yarn install
Iniciar o Servidor de Desenvolvimento do Expo
Execute o script do Expo CLI para gerar o ambiente de testes:

Bash
npm run start
# ou
yarn start
Execução no Dispositivo Físico

Abra o aplicativo Expo Go no seu celular.

Escaneie o QR Code impresso no terminal/navegador.

Nota: Para o funcionamento correto dos sensores de GPS e Câmera, conceda as permissões de uso solicitadas

Screenshots:

![alt text](image.png)

![alt text](image-1.png)

Grupo:

# Matheus Henrique Macêdo Costa - 01807287
# Kauã Filipe Moreno Marques - 01791750
# Lucas Teobaldo Cruz - 01802436
# Matheus Kastberg - 01816352
# Samuel Nikolas de Almeida Medeiros - 01786531
# Vagner Henrique - 01813729
# Victor Ribeiro Barbosa de Menezes - 01791754

Projetado e desenvolvido para fins acadêmicos — Uninassau.
