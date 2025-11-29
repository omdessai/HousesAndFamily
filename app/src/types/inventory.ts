export type ItemCategory = 'Appliance' | 'Electrical' | 'Plumbing' | 'Structural' | 'Furniture' | 'Other';

export interface InventoryItem {
    id: string;
    houseId: string;
    name: string;
    category: ItemCategory;
    brand?: string;
    modelNumber?: string;
    serialNumber?: string;
    purchaseDate?: string; // ISO Date
    warrantyExpiration?: string; // ISO Date
    notes?: string;
    photos?: string[];
}
