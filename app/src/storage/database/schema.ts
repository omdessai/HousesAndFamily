import { appSchema, tableSchema } from '@nozbe/watermelondb';

export const schema = appSchema({
    version: 1,
    tables: [
        tableSchema({
            name: 'houses',
            columns: [
                { name: 'name', type: 'string' },
                { name: 'address', type: 'string' },
                { name: 'interest', type: 'string' }, // Own, Rent, Wishlist
                { name: 'residence_type', type: 'string' }, // Primary, Vacation, Rental
                { name: 'is_favorite', type: 'boolean' },
                { name: 'created_at', type: 'number' },
                { name: 'updated_at', type: 'number' },
            ],
        }),
        tableSchema({
            name: 'people',
            columns: [
                { name: 'name', type: 'string' },
                { name: 'birth_date', type: 'number', isOptional: true }, // Storing as timestamp
                { name: 'avatar_uri', type: 'string', isOptional: true },
                { name: 'created_at', type: 'number' },
                { name: 'updated_at', type: 'number' },
            ],
        }),
        tableSchema({
            name: 'inventory_items',
            columns: [
                { name: 'house_id', type: 'string', isIndexed: true },
                { name: 'name', type: 'string' },
                { name: 'category', type: 'string' },
                { name: 'brand', type: 'string', isOptional: true },
                { name: 'model_number', type: 'string', isOptional: true },
                { name: 'serial_number', type: 'string', isOptional: true },
                { name: 'purchase_date', type: 'string', isOptional: true },
                { name: 'purchase_price', type: 'number', isOptional: true },
                { name: 'warranty_expiration', type: 'string', isOptional: true },
                { name: 'notes', type: 'string', isOptional: true },
                { name: 'photo_uri', type: 'string', isOptional: true },
                { name: 'receipt_uri', type: 'string', isOptional: true },
                { name: 'created_at', type: 'number' },
                { name: 'updated_at', type: 'number' },
            ],
        }),
        tableSchema({
            name: 'chores',
            columns: [
                { name: 'house_id', type: 'string', isIndexed: true },
                { name: 'title', type: 'string' },
                { name: 'description', type: 'string', isOptional: true },
                { name: 'due_date', type: 'string', isOptional: true },
                { name: 'frequency', type: 'string' }, // Once, Daily, Weekly, Monthly, Yearly
                { name: 'priority', type: 'string' }, // Low, Medium, High
                { name: 'assigned_to_id', type: 'string', isOptional: true, isIndexed: true },
                { name: 'is_completed', type: 'boolean' },
                { name: 'completed_at', type: 'string', isOptional: true },
                { name: 'created_at', type: 'number' },
                { name: 'updated_at', type: 'number' },
            ],
        }),
    ],
});
