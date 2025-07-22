# LocalStorage Keys Used in AccTrack

All localStorage keys in the AccTrack application follow the consistent naming pattern: `acctrack-{data-type}`

## Current localStorage Keys:

1. **`acctrack-contact-data`** - Contact and address information
2. **`acctrack-setup-completed`** - Setup completion flag
3. **`acctrack-storage-settings`** - Storage configuration settings
4. **`acctrack-business-data`** - Business information and details
5. **`acctrack-products`** - Product data for development mode

## Migration Notes:

- ✅ **UPDATED**: Changed `businessData` → `acctrack-business-data` for consistency
- ✅ **UPDATED**: Changed `products` → `acctrack-products` for consistency  
- ✅ **ALREADY CORRECT**: `acctrack-contact-data`
- ✅ **ALREADY CORRECT**: `acctrack-setup-completed`
- ✅ **ALREADY CORRECT**: `acctrack-storage-settings`

## Usage Locations:

- **Business Data**: `src/ui/hooks/useDatabase.ts`, `src/ui/utils/devMode.ts`
- **Contact Data**: `src/ui/hooks/useContactData.ts`
- **Products**: `src/ui/hooks/useDatabase.ts`, `src/ui/utils/devMode.ts`
- **Setup & Settings**: `src/ui/components/FirstTimeSetup.tsx`, `src/ui/utils/devMode.ts`

All keys now follow the consistent `acctrack-` prefix pattern for better organization and to avoid conflicts with other applications.
