import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Barcode from 'react-native-barcode-builder';
import { Product } from '../types/Product';
import { formatPrice } from '../utils/helpers';
import { StorageService } from '../services/StorageService';

interface ProductDetailScreenProps {
  navigation: any;
  route: any;
}

export default function ProductDetailScreen({ navigation, route }: ProductDetailScreenProps) {
  const product: Product = route.params.product;

  const handleEdit = () => {
    navigation.navigate('AddEditProduct', { product });
  };

  const handleDelete = () => {
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
              Alert.alert('Sucesso', 'Produto excluído com sucesso', [
                { text: 'OK', onPress: () => navigation.navigate('ProductList') }
              ]);
            } catch (error) {
              Alert.alert('Erro', 'Não foi possível excluir o produto');
            }
          }
        }
      ]
    );
  };

  const profitMargin = product.salePrice - product.purchasePrice;
  const profitPercentage = ((profitMargin / product.purchasePrice) * 100).toFixed(1);

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Text style={styles.productName}>{product.name}</Text>
          {product.description && (
            <Text style={styles.description}>{product.description}</Text>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Código de Barras</Text>
          <View style={styles.barcodeContainer}>
            <Barcode
              value={product.barcode}
              format="EAN"
              width={2}
              height={100}
              background="#fff"
            />
            <Text style={styles.barcodeText}>{product.barcode}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Identificação</Text>
          <View style={styles.infoRow}>
            <Ionicons name="pricetag-outline" size={20} color="#666" />
            <Text style={styles.infoLabel}>SKU:</Text>
            <Text style={styles.infoValue}>{product.sku}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preços</Text>
          
          <View style={styles.priceCard}>
            <View style={styles.priceItem}>
              <Text style={styles.priceLabel}>Preço de Compra</Text>
              <Text style={styles.priceValue}>{formatPrice(product.purchasePrice)}</Text>
            </View>
            
            <View style={styles.priceItem}>
              <Text style={styles.priceLabel}>Preço de Venda</Text>
              <Text style={[styles.priceValue, styles.salePrice]}>
                {formatPrice(product.salePrice)}
              </Text>
            </View>
          </View>

          <View style={styles.profitCard}>
            <View style={styles.profitItem}>
              <Text style={styles.profitLabel}>Margem de Lucro</Text>
              <Text style={[styles.profitValue, profitMargin >= 0 ? styles.positive : styles.negative]}>
                {formatPrice(profitMargin)}
              </Text>
            </View>
            <View style={styles.profitItem}>
              <Text style={styles.profitLabel}>Percentual</Text>
              <Text style={[styles.profitValue, profitMargin >= 0 ? styles.positive : styles.negative]}>
                {profitPercentage}%
              </Text>
            </View>
          </View>
        </View>

        {product.sizes.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Tamanhos Disponíveis</Text>
            <View style={styles.tagsContainer}>
              {product.sizes.map((size, index) => (
                <View key={index} style={styles.tag}>
                  <Text style={styles.tagText}>{size}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {product.colors.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Cores Disponíveis</Text>
            <View style={styles.tagsContainer}>
              {product.colors.map((color, index) => (
                <View key={index} style={styles.tag}>
                  <Text style={styles.tagText}>{color}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Estoque</Text>
          <View style={styles.stockCard}>
            <Ionicons name="cube-outline" size={32} color="#007AFF" />
            <View style={styles.stockInfo}>
              <Text style={styles.stockLabel}>Quantidade em Estoque</Text>
              <Text style={styles.stockValue}>{product.quantity} unidades</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Informações do Sistema</Text>
          <View style={styles.infoRow}>
            <Ionicons name="calendar-outline" size={20} color="#666" />
            <Text style={styles.infoLabel}>Criado em:</Text>
            <Text style={styles.infoValue}>
              {new Date(product.createdAt).toLocaleDateString('pt-BR')}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Ionicons name="time-outline" size={20} color="#666" />
            <Text style={styles.infoLabel}>Atualizado em:</Text>
            <Text style={styles.infoValue}>
              {new Date(product.updatedAt).toLocaleDateString('pt-BR')}
            </Text>
          </View>
        </View>

        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.editButton} onPress={handleEdit}>
            <Ionicons name="create-outline" size={24} color="#fff" />
            <Text style={styles.editButtonText}>Editar Produto</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
            <Ionicons name="trash-outline" size={24} color="#fff" />
            <Text style={styles.deleteButtonText}>Excluir Produto</Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    backgroundColor: '#007AFF',
    padding: 20,
    paddingTop: 60,
  },
  productName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    color: '#fff',
    opacity: 0.9,
  },
  section: {
    backgroundColor: '#fff',
    padding: 16,
    marginTop: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  barcodeContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  barcodeText: {
    fontSize: 16,
    color: '#333',
    marginTop: 12,
    fontWeight: '600',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  infoLabel: {
    fontSize: 16,
    color: '#666',
    marginLeft: 8,
    marginRight: 8,
  },
  infoValue: {
    fontSize: 16,
    color: '#333',
    fontWeight: '600',
  },
  priceCard: {
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
  },
  priceItem: {
    marginBottom: 12,
  },
  priceLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  priceValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  salePrice: {
    color: '#34C759',
  },
  profitCard: {
    backgroundColor: '#f0f9ff',
    borderRadius: 8,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  profitItem: {
    alignItems: 'center',
  },
  profitLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  profitValue: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  positive: {
    color: '#34C759',
  },
  negative: {
    color: '#FF3B30',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tag: {
    backgroundColor: '#007AFF',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    marginBottom: 8,
  },
  tagText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  stockCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
    padding: 16,
  },
  stockInfo: {
    marginLeft: 16,
  },
  stockLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  stockValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  actionButtons: {
    marginTop: 12,
    paddingHorizontal: 16,
  },
  editButton: {
    backgroundColor: '#007AFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
  },
  editButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  deleteButton: {
    backgroundColor: '#FF3B30',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 8,
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});
