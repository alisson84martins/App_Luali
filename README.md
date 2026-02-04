# App Luali - Sistema de Gerenciamento de Estoque

Aplicativo de gerenciamento de estoque desenvolvido em React Native/Expo para cadastro e controle de produtos.

## 📋 Funcionalidades

- ✅ Cadastro completo de produtos
- ✅ Tamanhos e cores personalizáveis
- ✅ Preços de compra e venda
- ✅ Geração automática de SKU
- ✅ Geração automática de código de barras (EAN-13)
- ✅ Visualização de código de barras
- ✅ Cálculo automático de margem de lucro
- ✅ Busca por nome, SKU ou código de barras
- ✅ Edição e exclusão de produtos
- ✅ Armazenamento local dos dados

## 🚀 Começando

### Pré-requisitos

- Node.js (versão 14 ou superior)
- npm ou yarn
- Expo CLI (instalado globalmente)

### Instalação

1. Clone o repositório:
```bash
git clone https://github.com/alisson84martins/App_Luali.git
cd App_Luali
```

2. Instale as dependências:
```bash
npm install
```

3. Inicie o aplicativo:
```bash
npm start
```

### Executando o App

#### Web
```bash
npm run web
```

#### Android
```bash
npm run android
```

#### iOS (somente em Mac)
```bash
npm run ios
```

Ou use o aplicativo Expo Go no seu smartphone para escanear o QR code.

## 📱 Funcionalidades Detalhadas

### Cadastro de Produtos

O aplicativo permite cadastrar produtos com as seguintes informações:

- **Nome**: Nome do produto
- **Descrição**: Descrição detalhada (opcional)
- **SKU**: Gerado automaticamente baseado no nome e timestamp
- **Código de Barras**: Gerado automaticamente no formato EAN-13
- **Preço de Compra**: Valor pago pelo produto
- **Preço de Venda**: Valor de venda do produto
- **Tamanhos**: Lista de tamanhos disponíveis (ex: P, M, G, GG)
- **Cores**: Lista de cores disponíveis (ex: Preto, Branco, Azul)
- **Quantidade**: Quantidade em estoque

### Visualização de Produtos

- Lista todos os produtos cadastrados
- Busca inteligente por nome, SKU ou código de barras
- Visualização detalhada com código de barras
- Cálculo automático de margem de lucro

### Gerenciamento

- Edição de produtos existentes
- Exclusão com confirmação
- Atualização automática de timestamps

## 🛠️ Tecnologias Utilizadas

- **React Native**: Framework para desenvolvimento mobile
- **Expo**: Plataforma para desenvolvimento React Native
- **TypeScript**: Tipagem estática
- **React Navigation**: Navegação entre telas
- **AsyncStorage**: Armazenamento local
- **react-native-barcode-builder**: Geração de códigos de barras
- **Expo Vector Icons**: Ícones

## 📂 Estrutura do Projeto

```
App_Luali/
├── src/
│   ├── screens/          # Telas do aplicativo
│   │   ├── ProductListScreen.tsx
│   │   ├── AddEditProductScreen.tsx
│   │   └── ProductDetailScreen.tsx
│   ├── services/         # Serviços (Storage, API, etc)
│   │   └── StorageService.ts
│   ├── types/           # Definições TypeScript
│   │   └── Product.ts
│   └── utils/           # Utilitários e helpers
│       └── helpers.ts
├── App.tsx              # Componente principal
└── package.json         # Dependências
```

## 💾 Armazenamento

Os dados são armazenados localmente no dispositivo usando AsyncStorage. Todos os produtos são salvos em formato JSON e persistem entre as sessões do aplicativo.

## 🔐 Segurança

- Validação de formulários
- Confirmação antes de exclusões
- Geração segura de códigos de barras com checksum

## 📝 Licença

Este projeto está sob a licença especificada no arquivo LICENSE.

## 👤 Autor

Alisson Martins

## 🤝 Contribuindo

Contribuições, issues e pedidos de funcionalidades são bem-vindos!
