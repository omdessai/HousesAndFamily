// Storage System Entry Point
export { storageService } from './StorageService';
export { imageStorage } from './adapters/ImageStorageAdapter';
export { databaseService } from './database/database';
export { BaseRepository } from './repositories/BaseRepository';

// Interfaces
export type {
    IStorageAdapter,
    ICacheAdapter,
    IImageStorage,
    IRepository,
    ImageCategory,
} from './interfaces/IStorage';

// Types
export type { Database } from '@nozbe/watermelondb';
