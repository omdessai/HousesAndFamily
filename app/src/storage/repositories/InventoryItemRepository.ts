import { BaseRepository } from './BaseRepository';
import InventoryItem from '../models/InventoryItem';
import { Database, Q } from '@nozbe/watermelondb';

export class InventoryItemRepository extends BaseRepository<InventoryItem> {
    constructor(database: Database) {
        super('inventory_items', database);
    }

    async createItem(data: {
        houseId: string;
        name: string;
        category: string;
        brand?: string | null;
        modelNumber?: string | null;
        serialNumber?: string | null;
        purchaseDate?: string | null;
        purchasePrice?: number | null;
        warrantyExpiration?: string | null;
        notes?: string | null;
        photoUri?: string | null;
        receiptUri?: string | null;
    }): Promise<InventoryItem> {
        return this.create({
            house_id: data.houseId,
            name: data.name,
            category: data.category,
            brand: data.brand ?? null,
            model_number: data.modelNumber ?? null,
            serial_number: data.serialNumber ?? null,
            purchase_date: data.purchaseDate ?? null,
            purchase_price: data.purchasePrice ?? null,
            warranty_expiration: data.warrantyExpiration ?? null,
            notes: data.notes ?? null,
            photo_uri: data.photoUri ?? null,
            receipt_uri: data.receiptUri ?? null,
            created_at: Date.now(),
            updated_at: Date.now(),
        });
    }

    async updateItem(
        id: string,
        data: Partial<{
            name: string;
            category: string;
            brand: string | null;
            modelNumber: string | null;
            serialNumber: string | null;
            purchaseDate: string | null;
            purchasePrice: number | null;
            warrantyExpiration: string | null;
            notes: string | null;
            photoUri: string | null;
            receiptUri: string | null;
        }>
    ): Promise<InventoryItem> {
        const updateData: any = {};
        if (data.name !== undefined) updateData.name = data.name;
        if (data.category !== undefined) updateData.category = data.category;
        if (data.brand !== undefined) updateData.brand = data.brand;
        if (data.modelNumber !== undefined) updateData.model_number = data.modelNumber;
        if (data.serialNumber !== undefined) updateData.serial_number = data.serialNumber;
        if (data.purchaseDate !== undefined) updateData.purchase_date = data.purchaseDate;
        if (data.purchasePrice !== undefined) updateData.purchase_price = data.purchasePrice;
        if (data.warrantyExpiration !== undefined) updateData.warranty_expiration = data.warrantyExpiration;
        if (data.notes !== undefined) updateData.notes = data.notes;
        if (data.photoUri !== undefined) updateData.photo_uri = data.photoUri;
        if (data.receiptUri !== undefined) updateData.receipt_uri = data.receiptUri;
        updateData.updated_at = Date.now();

        return this.update(id, updateData);
    }

    async getItemsForHouse(houseId: string): Promise<InventoryItem[]> {
        return await this.getCollection().query(Q.where('house_id', houseId)).fetch();
    }
}
