# FaunaLog

FaunaLog é um aplicativo mobile desenvolvido em **React Native com Expo** que identifica animais a partir da câmera do celular.
A ideia do projeto é funcionar como uma "Pokédex da fauna real", permitindo apontar a câmera para uma imagem ou animal e receber informações como nome, descrição, imagem de referência e nível de confiança da identificação.

O projeto foi desenvolvido como parte de um portfólio, explorando integração entre aplicativo mobile, câmera, API em Python e inteligência artificial para reconhecimento visual.

## Objetivo do projeto

O objetivo do FaunaLog é demonstrar uma solução prática de reconhecimento de animais usando tecnologias gratuitas e acessíveis.

O app permite:

* Capturar uma imagem usando a câmera do celular;
* Enviar a imagem para uma API;
* Comparar a imagem com uma base local de referências;
* Retornar o animal mais provável;
* Exibir nome, descrição, imagem e confiança da identificação;
* Ler o resultado em voz alta usando síntese de fala.

## Tecnologias utilizadas

### Aplicativo mobile

* React Native
* Expo
* Expo Router
* Expo Camera
* Expo Image Manipulator
* Expo Speech
* React Native Reanimated
* TypeScript

### API

* Python
* FastAPI
* Uvicorn
* Pillow
* Sentence Transformers
* CLIP ViT-B/32
* Wikipédia REST API

## Como funciona

O funcionamento geral do sistema é dividido em duas partes:

1. **Aplicativo mobile**

   * O usuário abre a câmera no app.
   * Captura uma imagem.
   * A imagem é redimensionada e enviada para a API.
   * O resultado é exibido na interface do app.

2. **API de reconhecimento**

   * A API recebe a imagem enviada pelo app.
   * O modelo CLIP gera um vetor de características da imagem.
   * Esse vetor é comparado com os vetores das imagens de referência salvas localmente.
   * O animal com maior similaridade é retornado.
   * A API também busca informações complementares na Wikipédia.

## Estrutura geral do projeto

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
├── package.json
├── app.json
└── README.md
```

A API Python pode ficar em um projeto separado ou em uma pasta própria, por exemplo:

```txt
faunalog-api/
├── app/
│   ├── main.py
│   ├── clip_service.py
│   └── animal_service.py
│
├── references/
│   ├── mico-leao-dourado/
│   ├── onca-pintada/
│   └── tatu/
│
├── requirements.txt
└── README.md
```

## Exemplo de resposta da API

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

## Funcionalidades

* Identificação de animais por imagem;
* Captura de foto pela câmera;
* Envio da imagem para API;
* Comparação com imagens de referência;
* Exibição da confiança da previsão;
* Exibição dos principais resultados encontrados;
* Busca automática de descrição e imagem pela Wikipédia;
* Leitura em voz alta do resultado;
* Interface inspirada em dispositivos de catálogo/registro de criaturas.

## Como executar o aplicativo

Instale as dependências:

```bash
npm install
```

Inicie o projeto Expo:

```bash
npx expo start
```

Depois, abra no emulador Android ou no dispositivo físico usando o Expo Go.

## Como executar a API

Entre na pasta da API:

```bash
cd faunalog-api
```

Crie e ative o ambiente virtual:

```bash
python -m venv venv
```

No Windows:

```bash
venv\Scripts\activate
```

Instale as dependências:

```bash
pip install -r requirements.txt
```

Execute o servidor:

```bash
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

A API ficará disponível em:

```txt
http://localhost:8000
```

Para testar no celular físico, use o IP da sua máquina na rede local, por exemplo:

```txt
http://192.168.0.111:8000
```

## Organização das imagens de referência

As imagens usadas para reconhecimento devem ficar dentro da pasta `references`, separadas por animal.

Exemplo:

```txt
references/
├── mico-leao-dourado/
│   ├── imagem1.jpg
│   ├── imagem2.jpg
│   └── imagem3.jpg
│
├── onca-pintada/
│   ├── imagem1.jpg
│   ├── imagem2.jpg
│   └── imagem3.jpg
│
└── tatu/
    ├── imagem1.jpg
    ├── imagem2.jpg
    └── imagem3.jpg
```

Cada pasta representa uma espécie ou animal que a API consegue reconhecer.

## Observações importantes

* A precisão depende diretamente da qualidade e variedade das imagens de referência.
* O projeto usa comparação visual com CLIP, não um modelo treinado especificamente para cada animal.
* Para melhorar os resultados, é recomendado usar várias imagens por animal, com ângulos, fundos e condições de iluminação diferentes.
* O app precisa estar na mesma rede da API quando usado em dispositivo físico durante o desenvolvimento.
* O endereço da API no app deve ser alterado conforme o IP local da máquina onde a API está rodando.

## Possíveis melhorias futuras

* Criar painel web para cadastrar animais e imagens de referência;
* Automatizar a coleta de imagens de referência;
* Melhorar o tratamento de nomes com acentos e hífens;
* Adicionar histórico de animais identificados;
* Adicionar favoritos;
* Salvar registros localmente;
* Criar tela de detalhes do animal;
* Adicionar mapa com localização aproximada do registro;
* Integrar APIs como iNaturalist ou GBIF;
* Criar ranking de confiança mais detalhado;
* Melhorar o design da interface mobile;
* Publicar a API em um servidor online.

## Status do projeto

Projeto em desenvolvimento.

Atualmente, o app já possui fluxo de câmera, envio de imagem para a API, retorno da identificação e exibição dos dados do animal.

## Autor

Desenvolvido por **Ediomar Nogueira** como projeto de portfólio.
