# Storage System Architecture

## Overview
The storage system is built with loose coupling and extensibility in mind, using the Repository pattern and Adapter pattern to abstract storage implementations.

## Architecture Layers

```
┌─────────────────────────────────────────┐
│         Application Layer               │
│    (Screens, Components, Hooks)         │
└──────────────┬──────────────────────────┘
               │
┌──────────────▼──────────────────────────┐
│        Storage Service (Facade)         │
│   - Unified interface to all storage    │
└──────────────┬──────────────────────────┘
               │
       ┌───────┴───────┐
       │               │
┌──────▼─────┐  ┌─────▼──────┐
│ Database   │  │   Image    │
│  Service   │  │  Storage   │
└──────┬─────┘  └─────┬──────┘
       │               │
┌──────▼─────┐  ┌─────▼──────┐
│ Watermelon │  │    RNFS    │
│     DB     │  │            │
└────────────┘  └────────────┘
```

## Components

### 1. Storage Interfaces (`src/storage/interfaces/`)
- **IStorageAdapter**: Generic storage operations
- **IRepository**: Repository pattern interface
- **IImageStorage**: Image storage operations
- **ICacheAdapter**: Cache operations (future)

### 2. Adapters (`src/storage/adapters/`)
- **ImageStorageAdapter**: Implements IImageStorage using RNFS
  - Organizes images by category (house, inventory, person, receipt)
  - Handles file operations (save, get, delete)
  - Auto-initializes directory structure

### 3. Database (`src/storage/database/`)
- **database.ts**: Database service singleton
- **schema.ts**: Watermelon DB schema definition
- **migrations.ts**: Schema migration definitions

### 4. Repositories (`src/storage/repositories/`)
- **BaseRepository**: Abstract base class with common CRUD operations
  - findAll(), findById(), create(), update(), delete()
  - findWhere() for filtered queries
  - Extensible for entity-specific operations

### 5. Storage Service (`src/storage/StorageService.ts`)
- Facade pattern for unified storage access
- Initializes all storage systems
- Provides getDatabase() and getImageStorage()

## Database Schema

### Tables
1. **houses**
   - name, address, interest, residence_type, is_favorite
   
2. **people**
   - name, relation, is_favorite, photo_uri

3. **inventory_items**
   - house_id (indexed), name, category, brand, model_number
   - serial_number, purchase_date, purchase_price
   - warranty_expiration, notes, photo_uri, receipt_uri

4. **chores**
   - house_id (indexed), title, description, due_date
   - frequency, priority, assigned_to_id (indexed)
   - is_completed, completed_at

## Usage

### Initialize Storage
```typescript
import { storageService } from './storage';

// In App.tsx or root component
await storageService.initialize();
```

### Using Image Storage
```typescript
import { imageStorage } from './storage';

// Save image
const path = await imageStorage.saveImage(
  'item-123',
  sourceUri,
  'inventory'
);

// Get image
const imagePath = await imageStorage.getImage('item-123');

// Delete image
await imageStorage.deleteImage('item-123');
```

### Creating a Repository (Future)
```typescript
import { BaseRepository } from './storage';
import { House } from './models/House';

class HouseRepository extends BaseRepository<House> {
  constructor(database: Database) {
    super('houses', database);
  }

  async findFavorites(): Promise<House[]> {
    return await this.findWhere({ is_favorite: true });
  }
}
```

## Design Principles

### 1. Loose Coupling
- Interfaces define contracts
- Implementations can be swapped
- No direct dependencies on concrete classes

### 2. Single Responsibility
- Each class has one reason to change
- Clear separation of concerns

### 3. Dependency Inversion
- Depend on abstractions (interfaces)
- Not on concrete implementations

### 4. Open/Closed Principle
- Open for extension (inherit BaseRepository)
- Closed for modification (interfaces stable)

## Extension Points

### Adding New Entity
1. Create model class (extends Model)
2. Add table to schema
3. Create repository (extends BaseRepository)
4. Add model to database.ts

### Adding New Storage Type
1. Define interface in IStorage.ts
2. Create adapter implementing interface
3. Add to StorageService
4. Export from index.ts

## Dependencies

```json
{
  "@nozbe/watermelondb": "^0.27.1",
  "@nozbe/with-observables": "^1.6.0",
  "react-native-fs": "^2.20.0",
  "@babel/plugin-proposal-decorators": "^7.24.0"
}
```

## Configuration

### Babel Config
```javascript
module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    ['@babel/plugin-proposal-decorators', { legacy: true }],
  ],
};
```

## Future Enhancements

1. **Cache Layer**: Add MMKV for fast key-value storage
2. **Sync Engine**: Implement backend synchronization
3. **Encryption**: Add SQLCipher for encrypted database
4. **Cloud Storage**: Integrate S3/Firebase for images
5. **Offline Queue**: Queue operations when offline
