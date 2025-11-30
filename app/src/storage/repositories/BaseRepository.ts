import { Model, Q } from '@nozbe/watermelondb';
import { IRepository } from '../interfaces/IStorage';
import { Database } from '@nozbe/watermelondb';

export abstract class BaseRepository<T extends Model> implements IRepository<any> {
    protected tableName: string;
    protected database: Database;

    constructor(tableName: string, database: Database) {
        this.tableName = tableName;
        this.database = database;
    }

    protected getCollection() {
        return this.database.get<T>(this.tableName);
    }

    async findAll(): Promise<T[]> {
        return await this.getCollection().query().fetch();
    }

    async findById(id: string): Promise<T | null> {
        try {
            return await this.getCollection().find(id);
        } catch (error) {
            return null;
        }
    }

    async create(data: any): Promise<T> {
        return await this.database.write(async () => {
            return await this.getCollection().create((record: any) => {
                Object.assign(record, data);
            });
        });
    }

    async update(id: string, data: Partial<any>): Promise<T> {
        return await this.database.write(async () => {
            const record = await this.getCollection().find(id);
            return await record.update((r: any) => {
                Object.assign(r, data);
            });
        });
    }

    async delete(id: string): Promise<void> {
        await this.database.write(async () => {
            const record = await this.getCollection().find(id);
            await record.markAsDeleted();
        });
    }

    async findWhere(criteria: Partial<any>): Promise<T[]> {
        const conditions = Object.entries(criteria)
            .filter(([_, value]) => value !== undefined)
            .map(([key, value]) => Q.where(key, value));

        if (conditions.length === 0) {
            return await this.findAll();
        }

        return await this.getCollection().query(...conditions).fetch();
    }

    async count(): Promise<number> {
        const records = await this.findAll();
        return records.length;
    }
}
