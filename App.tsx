/**
 * App.tsx - Componente raiz do aplicativo
 * 
 * Configura a navegação entre as telas usando React Navigation
 * Define o tema e estrutura geral do aplicativo
 */

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import ProductListScreen from './src/screens/ProductListScreen';
import AddEditProductScreen from './src/screens/AddEditProductScreen';
import ProductDetailScreen from './src/screens/ProductDetailScreen';

// Cria o navegador de pilha (stack navigator)
const Stack = createStackNavigator();

/**
 * Componente principal do aplicativo
 * 
 * Estrutura:
 * - NavigationContainer: Container que gerencia o estado de navegação
 * - Stack.Navigator: Gerencia a pilha de telas
 * - Stack.Screen: Define cada tela individual
 * 
 * Telas disponíveis:
 * 1. ProductList: Lista de produtos (tela inicial)
 * 2. AddEditProduct: Adicionar ou editar produto
 * 3. ProductDetail: Detalhes do produto com código de barras
 */
export default function App() {
  return (
    <NavigationContainer>
      {/* StatusBar com estilo claro para combinar com o header azul */}
      <StatusBar style="light" />
      
      {/* Configuração da navegação */}
      <Stack.Navigator
        initialRouteName="ProductList"
        screenOptions={{
          // Estilo do cabeçalho
          headerStyle: {
            backgroundColor: '#007AFF', // Azul do iOS
          },
          headerTintColor: '#fff', // Texto branco
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        {/* Tela de lista de produtos */}
        <Stack.Screen
          name="ProductList"
          component={ProductListScreen}
          options={{ headerShown: false }} // Esconde header (tela tem header customizado)
        />
        
        {/* Tela de adicionar/editar produto */}
        <Stack.Screen
          name="AddEditProduct"
          component={AddEditProductScreen}
          options={({ route }) => ({
            // Título dinâmico: muda baseado se está editando ou criando
            title: (route.params as any)?.product ? 'Editar Produto' : 'Novo Produto',
          })}
        />
        
        {/* Tela de detalhes do produto */}
        <Stack.Screen
          name="ProductDetail"
          component={ProductDetailScreen}
          options={{ title: 'Detalhes do Produto' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
