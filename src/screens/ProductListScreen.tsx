/**
 * ProductListScreen.tsx
 * 
 * Tela principal do aplicativo que exibe a lista de produtos cadastrados
 * 
 * Funcionalidades:
 * - Exibe lista de produtos em cards
 * - Busca por nome, SKU ou código de barras
 * - Pull-to-refresh para recarregar dados
 * - Navegação para detalhes do produto
 * - Botões de edição e exclusão rápida
 * - Botão FAB (+) para adicionar novo produto
 * - Mensagem quando não há produtos
 */

import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  Alert,
  RefreshControl
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { Product } from '../types/Product';
import { StorageService } from '../services/StorageService';
import { formatPrice } from '../utils/helpers';

// Props do componente
interface ProductListScreenProps {
  navigation: any;
}

export default function ProductListScreen({ navigation }: ProductListScreenProps) {
  // Estados do componente
  const [products, setProducts] = useState<Product[]>([]); // Lista de produtos
  const [searchQuery, setSearchQuery] = useState(''); // Texto da busca
  const [refreshing, setRefreshing] = useState(false); // Estado do pull-to-refresh

  /**
   * Carrega produtos do armazenamento local
   * Chamado ao entrar na tela e ao fazer refresh
   */
  const loadProducts = async () => {
    try {
      const loadedProducts = await StorageService.getProducts();
      setProducts(loadedProducts);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível carregar os produtos');
    }
  };

  /**
   * Hook que executa ao focar na tela
   * Garante que a lista seja atualizada quando voltar de outras telas
   */
  useFocusEffect(
    useCallback(() => {
      loadProducts();
    }, [])
  );

  /**
   * Handler do pull-to-refresh
   * Permite ao usuário arrastar a tela para baixo e recarregar dados
   */
  const onRefresh = async () => {
    setRefreshing(true);
    await loadProducts();
    setRefreshing(false);
  };

  /**
   * Exibe diálogo de confirmação e exclui produto
   * @param product - Produto a ser excluído
   */
  const handleDeleteProduct = (product: Product) => {
    Alert.alert(
      'Confirmar Exclusão',
      `Deseja realmente excluir o produto "${product.name}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            try {
              await StorageService.deleteProduct(product.id);
              await loadProducts(); // Recarrega lista
              Alert.alert('Sucesso', 'Produto excluído com sucesso');
            } catch (error) {
              Alert.alert('Erro', 'Não foi possível excluir o produto');
            }
          }
        }
      ]
    );
  };

  /**
   * Filtra produtos baseado na busca
   * Busca por: nome, SKU ou código de barras
   */
  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.barcode.includes(searchQuery)
  );

  /**
   * Renderiza cada card de produto na lista
   * @param item - Produto a ser renderizado
   */
  const renderProduct = ({ item }: { item: Product }) => (
    <TouchableOpacity
      style={styles.productCard}
      onPress={() => navigation.navigate('ProductDetail', { product: item })}
    >
      <View style={styles.productInfo}>
        <Text style={styles.productName}>{item.name}</Text>
        <Text style={styles.productSku}>SKU: {item.sku}</Text>
        <View style={styles.priceRow}>
          <Text style={styles.priceLabel}>Compra: </Text>
          <Text style={styles.priceValue}>{formatPrice(item.purchasePrice)}</Text>
          <Text style={styles.priceLabel}> | Venda: </Text>
          <Text style={[styles.priceValue, styles.salePriceValue]}>
            {formatPrice(item.salePrice)}
          </Text>
        </View>
        <View style={styles.detailsRow}>
          {item.sizes.length > 0 && (
            <Text style={styles.detailText}>
              Tamanhos: {item.sizes.join(', ')}
            </Text>
          )}
        </View>
        <View style={styles.detailsRow}>
          {item.colors.length > 0 && (
            <Text style={styles.detailText}>
              Cores: {item.colors.join(', ')}
            </Text>
          )}
        </View>
      </View>
      <View style={styles.actionButtons}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => navigation.navigate('AddEditProduct', { product: item })}
        >
          {/* Botão de editar produto */}
          <Ionicons name="create-outline" size={24} color="#007AFF" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => handleDeleteProduct(item)}
        >
          {/* Botão de excluir produto */}
          <Ionicons name="trash-outline" size={24} color="#FF3B30" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  /**
   * Renderização da tela
   * Estrutura:
   * 1. Header customizado com título
   * 2. Barra de busca
   * 3. Lista de produtos (FlatList)
   * 4. Botão FAB para adicionar produto
   */
  return (
    <View style={styles.container}>
      {/* Header customizado */}
      <View style={styles.header}>
        <Text style={styles.title}>Estoque Luali</Text>
      </View>
      
      {/* Barra de busca */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar por nome, SKU ou código de barras"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Lista de produtos com pull-to-refresh */}
      <FlatList
        data={filteredProducts}
        renderItem={renderProduct}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          // Componente exibido quando não há produtos
          <View style={styles.emptyContainer}>
            <Ionicons name="cube-outline" size={64} color="#ccc" />
            <Text style={styles.emptyText}>
              {searchQuery
                ? 'Nenhum produto encontrado'
                : 'Nenhum produto cadastrado'}
            </Text>
            {!searchQuery && (
              <Text style={styles.emptySubtext}>
                Clique no botão + para adicionar seu primeiro produto
              </Text>
            )}
          </View>
        }
      />

      {/* Botão FAB (Floating Action Button) para adicionar produto */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('AddEditProduct', { product: null })}
      >
        <Ionicons name="add" size={32} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}

/**
 * Estilos do componente
 * Organizado por seções para facilitar manutenção
 */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#007AFF',
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    margin: 16,
    marginBottom: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
  },
  listContainer: {
    padding: 16,
    paddingTop: 8,
  },
  productCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  productSku: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  priceLabel: {
    fontSize: 14,
    color: '#666',
  },
  priceValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  salePriceValue: {
    color: '#34C759',
  },
  detailsRow: {
    marginTop: 4,
  },
  detailText: {
    fontSize: 13,
    color: '#666',
  },
  actionButtons: {
    justifyContent: 'center',
    marginLeft: 12,
  },
  actionButton: {
    padding: 8,
    marginVertical: 4,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    color: '#999',
    marginTop: 16,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 14,
    color: '#aaa',
    marginTop: 8,
    textAlign: 'center',
    paddingHorizontal: 40,
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#007AFF',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
});
