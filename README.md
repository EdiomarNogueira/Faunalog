# FaunaLog Mobile

FaunaLog Mobile é o aplicativo front-end do projeto **FaunaLog**, desenvolvido em **React Native com Expo**.

O app permite capturar uma imagem pela câmera do celular, enviar essa imagem para uma API de reconhecimento de animais e exibir o resultado com nome, descrição, imagem, nível de confiança e leitura em voz alta.

A proposta do projeto é funcionar como uma espécie de catálogo inteligente da fauna, inspirado em uma Pokédex, mas voltado para animais reais.

## Objetivo

O objetivo deste front-end é demonstrar um aplicativo mobile completo utilizando câmera, consumo de API, manipulação de imagem, animações e síntese de voz.

O app faz parte de um projeto de portfólio e foi criado para apresentar habilidades com desenvolvimento mobile usando React Native e Expo.

## Funcionalidades

* Captura de imagem usando a câmera do celular;
* Redimensionamento e compressão da imagem antes do envio;
* Envio da imagem para uma API externa;
* Exibição do animal identificado;
* Exibição do nome popular;
* Exibição do nome científico ou nome retornado pela fonte de dados;
* Exibição do percentual de confiança da identificação;
* Exibição da melhor imagem de referência encontrada;
* Exibição de descrição do animal;
* Exibição dos principais resultados encontrados;
* Leitura em voz alta do resultado usando síntese de fala;
* Interface visual inspirada em um dispositivo de registro de fauna.

## Tecnologias utilizadas

* React Native
* Expo
* Expo Router
* TypeScript
* Expo Camera
* Expo Image Manipulator
* Expo Speech
* React Native Reanimated

## Estrutura do projeto

```txt
FaunaLog/
├── app/
│   ├── _layout.tsx
│   └── index.tsx
│
├── components/
│   └── baseFaunaLog/
│
├── assets/
│
├── app.json
├── package.json
├── package-lock.json
└── README.md
```

## Como executar o projeto

Instale as dependências:

```bash
npm install
```

Inicie o projeto com Expo:

```bash
npx expo start
```

Depois, abra o app em um emulador Android ou em um dispositivo físico usando o Expo Go.

## Configuração da API

Este repositório contém apenas o front-end mobile.
Para o reconhecimento funcionar, é necessário ter a API do FaunaLog rodando separadamente.

No arquivo responsável pela chamada da API, configure o endereço do servidor:

```ts
const API_URL = "http://SEU_IP_LOCAL:8000/predict";
```

Exemplo em rede local:

```ts
const API_URL = "http://192.168.0.111:8000/predict";
```

Ao testar em um celular físico, o aparelho e o computador onde a API está rodando precisam estar conectados na mesma rede Wi-Fi.

## Fluxo de funcionamento

1. O usuário abre o app.
2. O app solicita permissão para acessar a câmera.
3. O usuário captura uma imagem.
4. A imagem é redimensionada e comprimida.
5. O app envia a imagem para a API.
6. A API retorna o animal mais provável.
7. O app exibe as informações do animal.
8. O resultado é lido em voz alta.

## Exemplo de resposta esperada da API

```json
{
  "animal": "mico-leao-dourado",
  "display_name": "Mico-leão-dourado",
  "wikipedia_name": "Mico-leão-dourado",
  "confidence": 0.8419,
  "best_reference": "images (10).jpg",
  "data": {
    "name": "Mico-leão-dourado",
    "image": "https://upload.wikimedia.org/...",
    "description": "O mico-leão-dourado é um primata endêmico do Brasil...",
    "source": "https://pt.wikipedia.org/wiki/Mico-le%C3%A3o-dourado"
  },
  "top_results": [
    {
      "animal": "mico-leao-dourado",
      "display_name": "Mico-leão-dourado",
      "wikipedia_name": "Mico-leão-dourado",
      "confidence": 0.8419,
      "best_reference": "images (10).jpg"
    }
  ]
}
```

## Permissões necessárias

O app precisa de permissão para acessar a câmera do dispositivo.

Durante o uso, o Expo solicitará essa permissão automaticamente.

## Observações importantes

* Este projeto é apenas o front-end mobile.
* A identificação dos animais não é feita localmente no app.
* O app depende de uma API externa para processar a imagem.
* Durante o desenvolvimento, o IP da API pode mudar conforme a rede utilizada.
* Para funcionar em dispositivo físico, app e API precisam estar na mesma rede local.
* A qualidade da identificação depende da API e das imagens de referência cadastradas no back-end.

## Possíveis melhorias futuras

* Criar tela de histórico de identificações;
* Salvar animais identificados localmente;
* Adicionar tela de detalhes do animal;
* Criar sistema de favoritos;
* Melhorar tratamento de erro quando a API estiver offline;
* Adicionar loading visual mais elaborado;
* Adicionar suporte a modo offline com cache de resultados;
* Melhorar responsividade da interface;
* Criar configurações para alterar o endereço da API pelo próprio app;
* Publicar versão de demonstração do app.

## Status do projeto

Projeto em desenvolvimento.

Atualmente, o app possui fluxo de câmera, envio de imagem para API, exibição do resultado e leitura em voz alta.

## Autor

Desenvolvido por **Ediomar Nogueira** como projeto de portfólio.
