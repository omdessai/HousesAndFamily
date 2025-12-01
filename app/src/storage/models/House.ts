import { Model } from '@nozbe/watermelondb';
import { field, date, readonly, children } from '@nozbe/watermelondb/decorators';
import InventoryItem from './InventoryItem';
import Chore from './Chore';

export default class House extends Model {
    static table = 'houses';

    static associations = {
        inventory_items: { type: 'has_many', foreignKey: 'house_id' },
        chores: { type: 'has_many', foreignKey: 'house_id' },
    } as const;

    @field('name') name!: string;
    @field('address') address!: string;
    @field('interest') interest!: string; // Own, Rent, Wishlist
    @field('residence_type') residenceType!: string; // Primary, Vacation, Rental
    @field('is_favorite') isFavorite!: boolean;

    @readonly @date('created_at') createdAt!: Date;
    @readonly @date('updated_at') updatedAt!: Date;

    @children('inventory_items') inventoryItems!: any;
    @children('chores') chores!: any;
}
