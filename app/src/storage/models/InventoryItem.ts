import { Model } from '@nozbe/watermelondb';
import { field, date, readonly, relation } from '@nozbe/watermelondb/decorators';
import House from './House';

export default class InventoryItem extends Model {
    static table = 'inventory_items';

    static associations = {
        houses: { type: 'belongs_to', key: 'house_id' },
    } as const;

    @field('house_id') houseId!: string;
    @field('name') name!: string;
    @field('category') category!: string;
    @field('brand') brand!: string | null;
    @field('model_number') modelNumber!: string | null;
    @field('serial_number') serialNumber!: string | null;
    @field('purchase_date') purchaseDate!: string | null;
    @field('purchase_price') purchasePrice!: number | null;
    @field('warranty_expiration') warrantyExpiration!: string | null;
    @field('notes') notes!: string | null;
    @field('photo_uri') photoUri!: string | null;
    @field('receipt_uri') receiptUri!: string | null;

    @readonly @date('created_at') createdAt!: Date;
    @readonly @date('updated_at') updatedAt!: Date;

    @relation('houses', 'house_id') house!: any;
}
