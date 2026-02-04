import { v4 as uuidv4 } from 'uuid';

/**
 * Gera um SKU único baseado no nome do produto e timestamp
 * 
 * Formato: XXXX-NNNNNN-RRR
 * - XXXX: Primeiras 4 letras do nome (maiúsculas, sem caracteres especiais)
 * - NNNNNN: Últimos 6 dígitos do timestamp
 * - RRR: 3 caracteres aleatórios
 * 
 * @param productName - Nome do produto
 * @returns SKU único no formato XXXX-NNNNNN-RRR
 * 
 * @example
 * generateSKU("Camiseta Básica") // retorna algo como "CAMI-123456-A7B"
 */
export const generateSKU = (productName: string): string => {
  // Limpa o nome: remove caracteres especiais, converte para maiúsculas
  // e pega os primeiros 4 caracteres, preenchendo com 'X' se necessário
  const cleanName = productName
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, '')
    .substring(0, 4)
    .padEnd(4, 'X');
  
  // Pega os últimos 6 dígitos do timestamp atual
  const timestamp = Date.now().toString().slice(-6);
  
  // Gera 3 caracteres aleatórios em base 36 (0-9, a-z)
  const random = Math.random().toString(36).substring(2, 5).toUpperCase();
  
  // Combina tudo no formato final
  return `${cleanName}-${timestamp}-${random}`;
};

/**
 * Gera um código de barras único no formato EAN-13
 * 
 * EAN-13 é um padrão internacional de código de barras com 13 dígitos
 * Composto por 12 dígitos aleatórios + 1 dígito verificador
 * 
 * @returns Código de barras EAN-13 válido (13 dígitos)
 * 
 * @example
 * generateBarcode() // retorna algo como "1234567890128"
 */
export const generateBarcode = (): string => {
  // Gera 12 dígitos aleatórios
  let barcode = '';
  for (let i = 0; i < 12; i++) {
    barcode += Math.floor(Math.random() * 10);
  }
  
  // Calcula o dígito verificador usando o algoritmo EAN-13
  // Soma alternada: posições pares multiplicadas por 1, ímpares por 3
  let sum = 0;
  for (let i = 0; i < 12; i++) {
    const digit = parseInt(barcode[i]);
    sum += i % 2 === 0 ? digit : digit * 3;
  }
  
  // Dígito verificador: (10 - (soma % 10)) % 10
  const checkDigit = (10 - (sum % 10)) % 10;
  
  // Retorna os 12 dígitos + dígito verificador
  return barcode + checkDigit;
};

/**
 * Valida se uma string é um código de barras EAN-13 válido
 * 
 * Verifica:
 * 1. Se tem exatamente 13 dígitos
 * 2. Se o dígito verificador está correto
 * 
 * @param barcode - String com o código de barras a validar
 * @returns true se o código é válido, false caso contrário
 * 
 * @example
 * validateBarcode("1234567890128") // retorna true ou false
 */
export const validateBarcode = (barcode: string): boolean => {
  // Verifica se tem exatamente 13 dígitos
  if (!/^\d{13}$/.test(barcode)) {
    return false;
  }
  
  // Calcula a soma usando o algoritmo EAN-13
  let sum = 0;
  for (let i = 0; i < 12; i++) {
    const digit = parseInt(barcode[i]);
    sum += i % 2 === 0 ? digit : digit * 3;
  }
  
  // Calcula o dígito verificador esperado
  const checkDigit = (10 - (sum % 10)) % 10;
  
  // Compara com o último dígito do código
  return checkDigit === parseInt(barcode[12]);
};

/**
 * Formata um valor numérico como preço em reais (BRL)
 * 
 * Usa o formato brasileiro: R$ 1.234,56
 * 
 * @param price - Valor numérico a ser formatado
 * @returns String formatada com o preço (ex: "R$ 10,50")
 * 
 * @example
 * formatPrice(10.5) // retorna "R$ 10,50"
 * formatPrice(1234.56) // retorna "R$ 1.234,56"
 */
export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(price);
};

/**
 * Converte uma string de preço para número
 * 
 * Suporta múltiplos formatos:
 * - Brasileiro: "1.234,56" → 1234.56
 * - Americano: "1,234.56" → 1234.56
 * - Simples: "1234.56" ou "1234,56"
 * 
 * @param priceStr - String com o preço a ser convertido
 * @returns Valor numérico ou 0 se a conversão falhar
 * 
 * @example
 * parsePrice("R$ 10,50") // retorna 10.5
 * parsePrice("1.234,56") // retorna 1234.56
 * parsePrice("1,234.56") // retorna 1234.56
 */
export const parsePrice = (priceStr: string): number => {
  // Remove todos os caracteres que não são dígitos, vírgula ou ponto
  const cleaned = priceStr.replace(/[^\d.,]/g, '');
  
  // Se tem vírgula E ponto, precisa identificar qual é o separador decimal
  if (cleaned.includes(',') && cleaned.includes('.')) {
    // Se vírgula vem depois do ponto, é formato europeu/brasileiro (1.234,56)
    if (cleaned.lastIndexOf(',') > cleaned.lastIndexOf('.')) {
      // Remove pontos (separador de milhares) e troca vírgula por ponto
      return parseFloat(cleaned.replace(/\./g, '').replace(',', '.')) || 0;
    } else {
      // Formato americano (1,234.56) - apenas remove vírgulas
      return parseFloat(cleaned.replace(/,/g, '')) || 0;
    }
  }
  
  // Se tem apenas vírgula, assume que é separador decimal (formato brasileiro)
  if (cleaned.includes(',')) {
    return parseFloat(cleaned.replace(',', '.')) || 0;
  }
  
  // Caso contrário, tenta converter diretamente
  return parseFloat(cleaned) || 0;
};
