// Storage abstraction interfaces
export interface IStorageAdapter<T> {
    getAll(): Promise<T[]>;
    getById(id: string): Promise<T | null>;
    create(data: Omit<T, 'id'>): Promise<T>;
    update(id: string, data: Partial<T>): Promise<T>;
    delete(id: string): Promise<void>;
    query(filter: Partial<T>): Promise<T[]>;
}

export interface ICacheAdapter {
    set(key: string, value: string, ttl?: number): Promise<void>;
    get(key: string): Promise<string | null>;
    remove(key: string): Promise<void>;
    clear(): Promise<void>;
    has(key: string): Promise<boolean>;
}

export interface IImageStorage {
    saveImage(key: string, sourceUri: string, category: ImageCategory): Promise<string>;
    getImage(key: string): Promise<string | null>;
    deleteImage(key: string): Promise<void>;
    getImageSize(key: string): Promise<number>;
}

export type ImageCategory = 'house' | 'inventory' | 'person' | 'receipt';

export interface IRepository<T> {
    findAll(): Promise<T[]>;
    findById(id: string): Promise<T | null>;
    create(data: Omit<T, 'id'>): Promise<T>;
    update(id: string, data: Partial<T>): Promise<T>;
    delete(id: string): Promise<void>;
    findWhere(criteria: Partial<T>): Promise<T[]>;
}
