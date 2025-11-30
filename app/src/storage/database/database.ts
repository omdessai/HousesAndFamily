import { Database } from '@nozbe/watermelondb';
import SQLiteAdapter from '@nozbe/watermelondb/adapters/sqlite';
import { schema } from './schema';
import { migrations } from './migrations';

import Person from '../models/Person';

// Model imports will go here when we create actual models
// import House from '../models/House';
// import InventoryItem from '../models/InventoryItem';
// import Chore from '../models/Chore';

class DatabaseService {
    private database: Database | null = null;

    async initialize(): Promise<Database> {
        if (this.database) {
            return this.database;
        }

        const adapter = new SQLiteAdapter({
            schema,
            migrations,
            jsi: false, // Temporarily disable JSI to debug crash
            onSetUpError: (error) => {
                console.error('Database setup error:', error);
            },
        });

        this.database = new Database({
            adapter,
            modelClasses: [
                Person,
                // Add model classes here when created
                // House,
                // InventoryItem,
                // Chore,
            ],
        });

        return this.database;
    }

    getDatabase(): Database {
        if (!this.database) {
            throw new Error('Database not initialized. Call initialize() first.');
        }
        return this.database;
    }

    async resetDatabase(): Promise<void> {
        if (this.database) {
            await this.database.write(async () => {
                await this.database!.unsafeResetDatabase();
            });
        }
    }
}

// Singleton instance
export const databaseService = new DatabaseService();
export type { Database };
