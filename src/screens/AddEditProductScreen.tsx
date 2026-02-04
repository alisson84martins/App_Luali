/**
 * AddEditProductScreen.tsx
 * 
 * Tela de formulário para adicionar ou editar produtos
 * 
 * Funcionalidades:
 * - Formulário completo de cadastro de produto
 * - Geração automática de SKU baseada no nome
 * - Geração automática de código de barras EAN-13
 * - Validação de campos obrigatórios
 * - Modo criação ou edição (detectado automaticamente)
 * - SKU e barcode não editáveis após criação
 * - Suporte a tamanhos e cores múltiplos (separados por vírgula)
 * - KeyboardAvoidingView para iOS
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Product, ProductFormData } from '../types/Product';
import { StorageService } from '../services/StorageService';
import { generateSKU, generateBarcode, parsePrice } from '../utils/helpers';
import { v4 as uuidv4 } from 'uuid';

// Props do componente
interface AddEditProductScreenProps {
  navigation: any;
  route: any;
}

export default function AddEditProductScreen({ navigation, route }: AddEditProductScreenProps) {
  // Determina se está editando ou criando
  const existingProduct: Product | null = route.params?.product || null;
  const isEdit = existingProduct !== null;

  // Estado do formulário (todos os campos são strings para facilitar input)
  const [formData, setFormData] = useState<ProductFormData>({
    name: existingProduct?.name || '',
    purchasePrice: existingProduct?.purchasePrice.toString() || '',
    salePrice: existingProduct?.salePrice.toString() || '',
    sizes: existingProduct?.sizes.join(', ') || '', // Junta array em string
    colors: existingProduct?.colors.join(', ') || '', // Junta array em string
    description: existingProduct?.description || '',
    quantity: existingProduct?.quantity.toString() || '0',
  });

  // Estados separados para SKU e barcode
  const [sku, setSku] = useState(existingProduct?.sku || '');
  const [barcode, setBarcode] = useState(existingProduct?.barcode || '');

  /**
   * Atualiza o título da tela baseado no modo (editar/criar)
   */
  useEffect(() => {
    navigation.setOptions({
      title: isEdit ? 'Editar Produto' : 'Novo Produto',
    });
  }, [isEdit]);

  /**
   * Gera SKU automaticamente baseado no nome do produto
   * Só funciona se o nome estiver preenchido
   */
  const handleGenerateSKU = () => {
    if (!formData.name.trim()) {
      Alert.alert('Atenção', 'Digite o nome do produto primeiro');
      return;
    }
    const newSku = generateSKU(formData.name);
    setSku(newSku);
  };

  /**
   * Gera código de barras EAN-13 aleatório
   */
  const handleGenerateBarcode = () => {
    const newBarcode = generateBarcode();
    setBarcode(newBarcode);
  };

  /**
   * Valida todos os campos obrigatórios do formulário
   * @returns true se válido, false caso contrário
   */
  const validateForm = (): boolean => {
    if (!formData.name.trim()) {
      Alert.alert('Erro', 'O nome do produto é obrigatório');
      return false;
    }
    if (!sku.trim()) {
      Alert.alert('Erro', 'O SKU é obrigatório. Clique em "Gerar SKU"');
      return false;
    }
    if (!barcode.trim()) {
      Alert.alert('Erro', 'O código de barras é obrigatório. Clique em "Gerar Código"');
      return false;
    }
    if (!formData.purchasePrice || parseFloat(formData.purchasePrice) <= 0) {
      Alert.alert('Erro', 'O preço de compra deve ser maior que zero');
      return false;
    }
    if (!formData.salePrice || parseFloat(formData.salePrice) <= 0) {
      Alert.alert('Erro', 'O preço de venda deve ser maior que zero');
      return false;
    }
    return true;
  };

  /**
   * Salva o produto (cria novo ou atualiza existente)
   * Valida formulário, converte dados e persiste no armazenamento
   */
  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      // Monta objeto Product convertendo strings para tipos corretos
      const productData: Product = {
        id: existingProduct?.id || uuidv4(), // Mantém ID ou cria novo
        name: formData.name.trim(),
        sku: sku.trim(),
        barcode: barcode.trim(),
        purchasePrice: parseFloat(formData.purchasePrice),
        salePrice: parseFloat(formData.salePrice),
        // Converte string "P, M, G" em array ["P", "M", "G"]
        sizes: formData.sizes
          .split(',')
          .map(s => s.trim())
          .filter(s => s.length > 0),
        // Converte string "Preto, Branco" em array ["Preto", "Branco"]
        colors: formData.colors
          .split(',')
          .map(c => c.trim())
          .filter(c => c.length > 0),
        description: formData.description.trim(),
        quantity: parseInt(formData.quantity) || 0,
        createdAt: existingProduct?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      // Salva conforme modo (editar ou criar)
      if (isEdit) {
        await StorageService.updateProduct(productData);
        Alert.alert('Sucesso', 'Produto atualizado com sucesso', [
          { text: 'OK', onPress: () => navigation.goBack() }
        ]);
      } else {
        await StorageService.addProduct(productData);
        Alert.alert('Sucesso', 'Produto cadastrado com sucesso', [
          { text: 'OK', onPress: () => navigation.goBack() }
        ]);
      }
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível salvar o produto');
      console.error(error);
    }
  };

  /**
   * Renderização da tela
   * KeyboardAvoidingView ajusta o layout quando o teclado aparece
   * ScrollView permite scroll quando há muitos campos
   */
  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* Seção: Informações Básicas */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Informações Básicas</Text>
          
          <Text style={styles.label}>Nome do Produto *</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex: Camiseta Básica"
            value={formData.name}
            onChangeText={(text) => setFormData({ ...formData, name: text })}
          />

          <Text style={styles.label}>Descrição</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Descrição detalhada do produto"
            value={formData.description}
            onChangeText={(text) => setFormData({ ...formData, description: text })}
            multiline
            numberOfLines={3}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Identificação</Text>
          
          <Text style={styles.label}>SKU *</Text>
          <View style={styles.inputWithButton}>
            <TextInput
              style={[styles.input, styles.inputFlex]}
              placeholder="SKU gerado automaticamente"
              value={sku}
              onChangeText={setSku}
              editable={!isEdit}
            />
            {!isEdit && (
              <TouchableOpacity style={styles.generateButton} onPress={handleGenerateSKU}>
                <Ionicons name="refresh" size={20} color="#fff" />
                <Text style={styles.generateButtonText}>Gerar</Text>
              </TouchableOpacity>
            )}
          </View>

          <Text style={styles.label}>Código de Barras *</Text>
          <View style={styles.inputWithButton}>
            <TextInput
              style={[styles.input, styles.inputFlex]}
              placeholder="Código de barras"
              value={barcode}
              onChangeText={setBarcode}
              keyboardType="numeric"
              editable={!isEdit}
            />
            {!isEdit && (
              <TouchableOpacity style={styles.generateButton} onPress={handleGenerateBarcode}>
                <Ionicons name="barcode-outline" size={20} color="#fff" />
                <Text style={styles.generateButtonText}>Gerar</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preços</Text>
          
          <Text style={styles.label}>Preço de Compra (R$) *</Text>
          <TextInput
            style={styles.input}
            placeholder="0.00"
            value={formData.purchasePrice}
            onChangeText={(text) => setFormData({ ...formData, purchasePrice: text })}
            keyboardType="decimal-pad"
          />

          <Text style={styles.label}>Preço de Venda (R$) *</Text>
          <TextInput
            style={styles.input}
            placeholder="0.00"
            value={formData.salePrice}
            onChangeText={(text) => setFormData({ ...formData, salePrice: text })}
            keyboardType="decimal-pad"
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Variações</Text>
          
          <Text style={styles.label}>Tamanhos</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex: P, M, G, GG (separados por vírgula)"
            value={formData.sizes}
            onChangeText={(text) => setFormData({ ...formData, sizes: text })}
          />

          <Text style={styles.label}>Cores</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex: Preto, Branco, Azul (separados por vírgula)"
            value={formData.colors}
            onChangeText={(text) => setFormData({ ...formData, colors: text })}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Estoque</Text>
          
          <Text style={styles.label}>Quantidade</Text>
          <TextInput
            style={styles.input}
            placeholder="0"
            value={formData.quantity}
            onChangeText={(text) => setFormData({ ...formData, quantity: text })}
            keyboardType="numeric"
          />
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.cancelButton} onPress={() => navigation.goBack()}>
            <Text style={styles.cancelButtonText}>Cancelar</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveButtonText}>
              {isEdit ? 'Atualizar' : 'Salvar'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
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
  scrollContent: {
    padding: 16,
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginBottom: 8,
    marginTop: 12,
  },
  input: {
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  inputWithButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  inputFlex: {
    flex: 1,
    marginRight: 8,
  },
  generateButton: {
    backgroundColor: '#007AFF',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderRadius: 8,
  },
  generateButtonText: {
    color: '#fff',
    fontWeight: '600',
    marginLeft: 4,
    fontSize: 14,
  },
  buttonContainer: {
    flexDirection: 'row',
    marginTop: 8,
    marginBottom: 32,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginRight: 8,
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
  saveButton: {
    flex: 1,
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginLeft: 8,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
});
