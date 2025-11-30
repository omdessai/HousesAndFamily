import { databaseService } from './database/database';
import { imageStorage } from './adapters/ImageStorageAdapter';
import type { Database } from '@nozbe/watermelondb';

/**
 * Storage Service - Facade for all storage operations
 * Provides a unified interface to access database and image storage
 */
class StorageService {
    private database: Database | null = null;

    /**
     * Initialize all storage systems
     */
    async initialize(): Promise<void> {
        try {
            // Initialize database
            this.database = await databaseService.initialize();

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
