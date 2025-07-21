# SQLite Migration Guide

## Overview

This application has been migrated from localStorage-based storage to SQLite database storage using Electron and sqlite3. This provides better data integrity, performance, and the ability to handle complex queries.

## Architecture Changes

### 1. Database Layer (`src/electron/database/db.ts`)

- **SQLite Database**: Created a centralized database class that manages all data operations
- **Database Location**: `%APPDATA%/acctrack-frontend/acctrack.db` (Windows)
- **Tables Created**:
  - `business_data` - Stores business information
  - `products` - Product catalog
  - `quotations` - Customer quotations
  - `invoices` - Invoice data
  - `purchase_orders` - Purchase order data

### 2. Electron Main Process (`src/electron/main.ts`)

- **Database Initialization**: Database is initialized when the app starts
- **IPC Handlers**: Added handlers for all CRUD operations:
  - `saveBusinessData` / `getBusinessData`
  - `saveProduct` / `getProducts` / `updateProduct` / `deleteProduct`  
  - `saveQuotation` / `getQuotations`

### 3. Preload Script (`src/electron/preload.ts`)

- **API Exposure**: Exposes database operations to the renderer process
- **Type Safety**: Full TypeScript definitions for all data types
- **Legacy Support**: Maintains backward compatibility with existing `saveFile`/`readFile` methods

### 4. React Hooks (`src/ui/hooks/useDatabase.ts`)

- **Database Service**: Created React hooks for easy database interaction
- **Fallback Support**: Graceful fallback to localStorage when running in web environment
- **Specialized Hooks**:
  - `useBusinessData(userId)` - For business data management
  - `useProducts()` - For product CRUD operations
  - `useDatabase()` - General database operations

### 5. Component Updates

- **BusinessForm**: Updated to use the new SQLite-based storage
- **AppHeader**: Updated to load business name from SQLite
- **Type Definitions**: Updated `src/types/renderer.d.ts` with new interface definitions

## Data Migration

### Existing Data
- **Backward Compatibility**: The system maintains compatibility with existing localStorage data
- **Automatic Detection**: Components detect whether they're running in Electron or web environment
- **Fallback Strategy**: If SQLite is unavailable, components fall back to localStorage

### Data Structure
All data is properly typed and structured:

```typescript
interface BusinessData {
  id?: string;
  businessType: string;
  registrationNumber: string;
  // ... other fields
  createdAt?: string;
  updatedAt?: string;
}
```

## Development Setup

### Prerequisites
- Node.js 20+
- pnpm package manager
- Python (for native module compilation)
- Visual Studio Build Tools (Windows)

### Installation
```bash
pnpm install
```

The `postinstall` script automatically rebuilds native modules for Electron.

### Running the Application
```bash
# Development (React only)
pnpm run dev:react

# Development (Electron)
pnpm run transpile && pnpm run dev:electron

# Production Build
pnpm run build && pnpm run dist-win
```

## Database Operations

### Business Data
```typescript
// Save business data
await window.electron.saveBusinessData('user123', businessData);

// Get business data
const data = await window.electron.getBusinessData('user123');
```

### Products
```typescript
// Create product
await window.electron.saveProduct(productData);

// Get all products
const result = await window.electron.getProducts();
const products = result.data;

// Update product
await window.electron.updateProduct(productId, partialData);

// Delete product
await window.electron.deleteProduct(productId);
```

### Using React Hooks
```tsx
import { useBusinessData, useProducts } from '@/hooks/useDatabase';

function MyComponent() {
  const { businessData, loading, saveBusinessData } = useBusinessData('user123');
  const { products, saveProduct, deleteProduct } = useProducts();
  
  // Use the data and functions as needed
}
```

## File Structure

```
src/
├── electron/
│   ├── database/
│   │   └── db.ts              # SQLite database class
│   ├── main.ts                # Electron main process (updated)
│   └── preload.ts             # IPC bridge (updated)
├── ui/
│   ├── hooks/
│   │   └── useDatabase.ts     # React database hooks
│   └── components/
│       └── settings/
│           └── BusinessForm.tsx # Updated component
└── types/
    └── renderer.d.ts          # Type definitions (updated)
```

## Benefits of SQLite Migration

1. **Data Integrity**: ACID compliance ensures data consistency
2. **Performance**: Better performance for large datasets
3. **Queries**: Support for complex SQL queries
4. **Relationships**: Proper foreign key relationships between tables
5. **Backup**: Single file database is easy to backup
6. **Cross-Platform**: Works consistently across Windows, macOS, and Linux
7. **Offline**: No network dependency required

## Troubleshooting

### Native Module Issues
If you encounter SQLite binding errors:
```bash
npx electron-rebuild
```

### Database Location
The database is stored at:
- **Windows**: `%APPDATA%/acctrack-frontend/acctrack.db`
- **macOS**: `~/Library/Application Support/acctrack-frontend/acctrack.db`
- **Linux**: `~/.config/acctrack-frontend/acctrack.db`

### Web Fallback
When running in browser (not Electron), the application automatically falls back to localStorage for data persistence.

## Migration Status

✅ **Completed**:
- Database schema design
- Electron main process integration
- IPC communication setup
- React hooks for database operations
- BusinessForm component migration
- Type definitions update

🔄 **In Progress**:
- Other component migrations (Products, Quotations, etc.)
- Data validation and error handling
- Advanced query features

📋 **To Do**:
- Data export/import functionality
- Database migration scripts for schema changes
- Performance optimization for large datasets
