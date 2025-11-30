# Image Storage with Watermelon DB

## Recommended Strategy: File System + DB References

### Why Not Store in Database?

- Images are binary blobs (large)
- Storing in DB increases database size dramatically
- Slower queries and backups
- SQLite has practical limits for blob storage

### Best Practice: Store Images on File System, Reference Paths in DB

## 1. Use React Native File System (RNFS)

```bash
npm install react-native-fs
```

### Database Model

```typescript
// models/InventoryItem.ts
import { Model } from '@nozbe/watermelondb'
import { field, relation } from '@nozbe/watermelondb/decorators'

export default class InventoryItem extends Model {
  static table = 'inventory_items'
  
  @field('name') name!: string
  @field('photo_uri') photoUri!: string | null  // Store file path
  @field('receipt_uri') receiptUri!: string | null
  @relation('houses', 'house_id') house!: Relation<House>
}
```

## 2. Image Storage Structure

```
DocumentDirectory/
  ├── images/
  │   ├── houses/
  │   │   ├── {houseId}_main.jpg
  │   │   └── {houseId}_exterior.jpg
  │   ├── inventory/
  │   │   ├── {itemId}_photo.jpg
  │   │   └── {itemId}_receipt.jpg
  │   └── temp/
  │       └── {timestamp}_temp.jpg
```

## 3. Implementation

```typescript
// utils/imageStorage.ts
import RNFS from 'react-native-fs';

const IMAGES_DIR = `${RNFS.DocumentDirectoryPath}/images`;

export const ImageStorage = {
  async initialize() {
    await RNFS.mkdir(`${IMAGES_DIR}/houses`);
    await RNFS.mkdir(`${IMAGES_DIR}/inventory`);
    await RNFS.mkdir(`${IMAGES_DIR}/temp`);
  },

  async saveInventoryPhoto(itemId: string, sourceUri: string): Promise<string> {
    const extension = sourceUri.split('.').pop() || 'jpg';
    const filename = `${itemId}_photo.${extension}`;
    const destPath = `${IMAGES_DIR}/inventory/${filename}`;
    
    await RNFS.copyFile(sourceUri, destPath);
    return destPath;
  },

  async saveReceipt(itemId: string, sourceUri: string): Promise<string> {
    const extension = sourceUri.split('.').pop() || 'jpg';
    const filename = `${itemId}_receipt.${extension}`;
    const destPath = `${IMAGES_DIR}/inventory/${filename}`;
    
    await RNFS.copyFile(sourceUri, destPath);
    return destPath;
  },

  async deleteImage(uri: string): Promise<void> {
    if (await RNFS.exists(uri)) {
      await RNFS.unlink(uri);
    }
  },

  async getImageSize(uri: string): Promise<number> {
    const stat = await RNFS.stat(uri);
    return stat.size;
  }
};
```

## 4. Usage in Components

```typescript
// screens/ItemFormScreen.tsx
import { launchImageLibrary } from 'react-native-image-picker';
import { ImageStorage } from '../utils/imageStorage';

const ItemFormScreen = () => {
  const [photoUri, setPhotoUri] = useState<string | null>(null);

  const handleAddPhoto = async () => {
    const result = await launchImageLibrary({
      mediaType: 'photo',
      quality: 0.8, // Compress to reduce size
    });

    if (result.assets?.[0]?.uri) {
      // Save to file system and get permanent path
      const savedPath = await ImageStorage.saveInventoryPhoto(
        itemId,
        result.assets[0].uri
      );
      
      // Store path in Watermelon DB
      await item.update(i => {
        i.photoUri = savedPath;
      });
      
      setPhotoUri(savedPath);
    }
  };

  return (
    <Image source={{ uri: photoUri || undefined }} />
  );
};
```

## 5. Storage Options Comparison

| Approach | Pros | Cons | Recommendation |
|----------|------|------|----------------|
| **File System (RNFS)** | Fast, Scalable, Small DB | Manual cleanup needed | ⭐ **Best** |
| **Base64 in DB** | Simple, All in one place | Huge DB size, Slow | ❌ Avoid |
| **react-native-fs + Cache** | Fast reads, Auto cleanup | Complex cache management | ⚠️ Advanced use |
| **Cloud Storage (S3)** | Unlimited, Backup | Requires internet, Cost | 🔄 Future upgrade |

## 6. Best Practices

### Image Compression

```typescript
import ImageResizer from 'react-native-image-resizer';

async function compressAndSave(uri: string, itemId: string) {
  const resized = await ImageResizer.createResizedImage(
    uri,
    1200, // max width
    1200, // max height
    'JPEG',
    80, // quality
  );
  
  return await ImageStorage.saveInventoryPhoto(itemId, resized.uri);
}
```

### Cleanup on Delete

```typescript
// In your Watermelon DB model
class InventoryItem extends Model {
  async deleteWithImages() {
    // Delete associated images
    if (this.photoUri) {
      await ImageStorage.deleteImage(this.photoUri);
    }
    if (this.receiptUri) {
      await ImageStorage.deleteImage(this.receiptUri);
    }
    
    // Delete DB record
    await this.markAsDeleted();
  }
}
```

## 7. Migration to Cloud (Future)

When adding backend sync:
1. Keep local file system for offline access
2. Upload to S3/Firebase Storage on sync
3. Store cloud URL in separate field
4. Download on-demand for other devices

```typescript
@field('photo_uri') photoUri!: string              // Local path
@field('photo_cloud_url') photoCloudUrl!: string | null  // Cloud URL
```

## Summary

**Use File System Storage** because:
- ✅ Keeps database small and fast
- ✅ Native performance for image loading
- ✅ Easy to implement with RNFS
- ✅ Scalable to thousands of images
- ✅ Simple migration path to cloud storage later

## Required Packages

```bash
npm install react-native-fs
npm install react-native-image-picker
npm install react-native-image-resizer
```
