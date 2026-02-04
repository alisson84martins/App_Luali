# GitHub Copilot Instructions - App Luali

## Project Overview
React Native/Expo inventory management app for product registration with automatic SKU and barcode generation. Brazilian Portuguese UI with local-first architecture using AsyncStorage.

## Architecture

### Navigation Flow (Stack Navigator)
```
ProductList → AddEditProduct (create/edit)
           → ProductDetail → AddEditProduct (edit)
```
All screens in `src/screens/`. Navigation params typed as `any` - use `route.params.product` for Product objects.

### Data Flow
1. **StorageService** (`src/services/StorageService.ts`) - Single source of truth for all CRUD operations
2. **AsyncStorage** - Key: `@luali_products`, stores JSON array of Product objects
3. **No backend** - Everything persists locally on device
4. **useFocusEffect** hook used in ProductListScreen to reload data when navigating back

### Key Patterns

**Product Creation Flow:**
```typescript
// 1. Generate unique identifiers
const sku = generateSKU(productName); // Format: XXXX-NNNNNN-RRR
const barcode = generateBarcode(); // EAN-13 with checksum
const id = uuidv4();

// 2. Convert form strings to proper types
sizes: formData.sizes.split(',').map(s => s.trim()).filter(s => s.length > 0)
colors: formData.colors.split(',').map(c => c.trim()).filter(c => c.length > 0)

// 3. Persist with StorageService
await StorageService.addProduct(productData);
```

**Edit Mode Detection:**
```typescript
const existingProduct = route.params?.product || null;
const isEdit = existingProduct !== null;
// SKU and barcode are non-editable when isEdit === true
```

## Development Workflow

### Setup & Run
```bash
npm install
npm start              # Start Expo dev server
npm run android        # Android emulator
npm run ios            # iOS (Mac only)
npm run web            # Web (barcode component has limitations)
```

### Testing on Device (Recommended)
1. Install Expo Go on phone
2. Scan QR code from `npm start`
3. Data persists in AsyncStorage on device

### TypeScript Compilation
```bash
npx tsc --noEmit       # Type check without emitting files
```
Note: tsconfig extends `expo/tsconfig.base` which may not exist in CI environments.

## Project-Specific Conventions

### Price Handling
- **Storage**: Always `number` type in Product interface
- **Forms**: Always `string` type in ProductFormData interface
- **Parsing**: Use `parsePrice()` from helpers.ts - handles Brazilian format (1.234,56) and US format (1,234.56)
- **Display**: Use `formatPrice()` - outputs Brazilian Real (R$ 1.234,56)

### Profit Calculation
```typescript
// ALWAYS check for division by zero
const profitMargin = salePrice - purchasePrice;
const profitPercentage = purchasePrice > 0 
  ? ((profitMargin / purchasePrice) * 100).toFixed(1)
  : '0.0';
```

### Array Fields (Sizes/Colors)
- **Input**: Comma-separated strings: "P, M, G, GG"
- **Storage**: String arrays: `["P", "M", "G", "GG"]`
- **Always trim and filter empty strings** after splitting

### Component Styling
- Primary color: `#007AFF` (iOS blue) - used for headers, buttons, tags
- Destructive actions: `#FF3B30` (iOS red)
- Success text: `#34C759` (iOS green)
- All StyleSheets defined at bottom of file

## Critical Details

### Barcode Generation
- Uses EAN-13 standard with proper checksum calculation
- Algorithm in `generateBarcode()`: 12 random digits + 1 check digit
- Validation available via `validateBarcode()` but not enforced in UI
- **Web compatibility**: react-native-barcode-builder may not work on web - mobile-first design

### Form Validation
Required fields enforced in `validateForm()`:
- name (non-empty)
- sku (must be generated)
- barcode (must be generated)
- purchasePrice > 0
- salePrice > 0

### AsyncStorage Key
- Single key: `@luali_products`
- All products stored as single JSON array
- No pagination or chunking implemented
- Load entire dataset on app start

## Common Tasks

**Adding a new field to Product:**
1. Update `Product` interface in `src/types/Product.ts`
2. Update `ProductFormData` if user-editable
3. Add to AddEditProductScreen form
4. Update ProductDetailScreen display
5. Update ProductListScreen card if needed
6. Handle in `handleSave()` conversion logic

**Changing navigation:**
Edit `App.tsx` Stack.Navigator - all routes defined there with screen options.

**Modifying search:**
Update filter in ProductListScreen: `filteredProducts = products.filter(...)`
Currently searches: name, sku, barcode (case-insensitive for name/sku).

## Files to Check First
- `src/types/Product.ts` - Data structure
- `src/services/StorageService.ts` - All data operations
- `src/utils/helpers.ts` - SKU/barcode generation, price formatting
- `App.tsx` - Navigation structure
- `src/screens/ProductListScreen.tsx` - Main UI patterns
