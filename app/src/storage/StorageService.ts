import { databaseService } from './database/database';
import { imageStorage } from './adapters/ImageStorageAdapter';
import { PersonRepository } from './repositories/PersonRepository';
import { HouseRepository } from './repositories/HouseRepository';
import { InventoryItemRepository } from './repositories/InventoryItemRepository';
import { ChoreRepository } from './repositories/ChoreRepository';
import type { Database } from '@nozbe/watermelondb';

/**
 * Storage Service - Facade for all storage operations
 * Provides a unified interface to access database and image storage
 */
class StorageService {
    private database: Database | null = null;
    public personRepository: PersonRepository | null = null;
    public houseRepository: HouseRepository | null = null;
    public inventoryItemRepository: InventoryItemRepository | null = null;
    public choreRepository: ChoreRepository | null = null;

    /**
     * Initialize all storage systems
     */
    async initialize(): Promise<void> {
        try {
            // Initialize database
            this.database = await databaseService.initialize();

            // Initialize repositories
            this.personRepository = new PersonRepository(this.database);
            this.houseRepository = new HouseRepository(this.database);
            this.inventoryItemRepository = new InventoryItemRepository(this.database);
            this.choreRepository = new ChoreRepository(this.database);

            // Initialize image storage
            await imageStorage.initialize();

            console.log('Storage systems initialized successfully');
        } catch (error) {
            console.error('Failed to initialize storage:', error);
            throw error;
        }
    }

    /**
     * Get database instance
     */
    getDatabase(): Database {
        if (!this.database) {
            throw new Error('Storage not initialized. Call initialize() first.');
        }
        return this.database;
    }

    /**
     * Get Person Repository
     */
    getPersonRepository(): PersonRepository {
        if (!this.personRepository) {
            throw new Error('Storage not initialized. Call initialize() first.');
        }
        return this.personRepository;
    }

    getHouseRepository(): HouseRepository {
        if (!this.houseRepository) {
            throw new Error('Storage not initialized. Call initialize() first.');
        }
        return this.houseRepository;
    }

    getInventoryItemRepository(): InventoryItemRepository {
        if (!this.inventoryItemRepository) {
            throw new Error('Storage not initialized. Call initialize() first.');
        }
        return this.inventoryItemRepository;
    }

    getChoreRepository(): ChoreRepository {
        if (!this.choreRepository) {
            throw new Error('Storage not initialized. Call initialize() first.');
        }
        return this.choreRepository;
    }

    /**
     * Get image storage instance
     */
    getImageStorage() {
        return imageStorage;
    }

    /**
     * Reset all storage (useful for testing or logout)
     */
    async reset(): Promise<void> {
        await databaseService.resetDatabase();
        await imageStorage.clearTempImages();
    }

    /**
     * Check if storage is initialized
     */
    isInitialized(): boolean {
        return this.database !== null;
    }
}

// Singleton instance
export const storageService = new StorageService();
