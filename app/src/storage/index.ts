export { storageService } from './StorageService';
export { imageStorage } from './adapters/ImageStorageAdapter';
export { databaseService } from './database/database';
export { BaseRepository } from './repositories/BaseRepository';
export { PersonRepository } from './repositories/PersonRepository';
export { default as Person } from './models/Person';

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
