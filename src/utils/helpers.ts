import { v4 as uuidv4 } from 'uuid';

/**
 * Generates a unique SKU based on product name and timestamp
 */
export const generateSKU = (productName: string): string => {
  const cleanName = productName
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, '')
    .substring(0, 4)
    .padEnd(4, 'X');
  
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.random().toString(36).substring(2, 5).toUpperCase();
  
  return `${cleanName}-${timestamp}-${random}`;
};

/**
 * Generates a unique barcode (EAN-13 format)
 * This is a simplified version for demonstration
 */
export const generateBarcode = (): string => {
  // Generate 12 random digits
  let barcode = '';
  for (let i = 0; i < 12; i++) {
    barcode += Math.floor(Math.random() * 10);
  }
  
  // Calculate check digit (EAN-13 algorithm)
  let sum = 0;
  for (let i = 0; i < 12; i++) {
    const digit = parseInt(barcode[i]);
    sum += i % 2 === 0 ? digit : digit * 3;
  }
  const checkDigit = (10 - (sum % 10)) % 10;
  
  return barcode + checkDigit;
};

/**
 * Validates if a string is a valid EAN-13 barcode
 */
export const validateBarcode = (barcode: string): boolean => {
  if (!/^\d{13}$/.test(barcode)) {
    return false;
  }
  
  let sum = 0;
  for (let i = 0; i < 12; i++) {
    const digit = parseInt(barcode[i]);
    sum += i % 2 === 0 ? digit : digit * 3;
  }
  const checkDigit = (10 - (sum % 10)) % 10;
  
  return checkDigit === parseInt(barcode[12]);
};

/**
 * Formats a price value
 */
export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(price);
};

/**
 * Parses a price string to number
 * Handles Brazilian format (1.234,56) and simple format (1234.56)
 */
export const parsePrice = (priceStr: string): number => {
  // Remove all non-digit, non-comma, non-dot characters
  const cleaned = priceStr.replace(/[^\d.,]/g, '');
  
  // If there's both comma and dot, determine which is decimal separator
  if (cleaned.includes(',') && cleaned.includes('.')) {
    // If comma comes after dot, assume European format (1.234,56)
    if (cleaned.lastIndexOf(',') > cleaned.lastIndexOf('.')) {
      return parseFloat(cleaned.replace(/\./g, '').replace(',', '.')) || 0;
    } else {
      // Assume US format (1,234.56)
      return parseFloat(cleaned.replace(/,/g, '')) || 0;
    }
  }
  
  // If only comma, assume it's decimal separator (Brazilian format)
  if (cleaned.includes(',')) {
    return parseFloat(cleaned.replace(',', '.')) || 0;
  }
  
  // Otherwise, parse as-is
  return parseFloat(cleaned) || 0;
};
