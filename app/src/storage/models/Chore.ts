import { Model } from '@nozbe/watermelondb';
import { field, date, readonly, relation } from '@nozbe/watermelondb/decorators';
import House from './House';
import Person from './Person';

export default class Chore extends Model {
    static table = 'chores';

    static associations = {
        houses: { type: 'belongs_to', key: 'house_id' },
        people: { type: 'belongs_to', key: 'assigned_to_id' },
    } as const;

    @field('house_id') houseId!: string;
    @field('title') title!: string;
    @field('description') description!: string | null;
    @field('due_date') dueDate!: string | null;
    @field('frequency') frequency!: string;
    @field('priority') priority!: string;
    @field('assigned_to_id') assignedToId!: string | null;
    @field('is_completed') isCompleted!: boolean;
    @field('completed_at') completedAt!: string | null;

    @readonly @date('created_at') createdAt!: Date;
    @readonly @date('updated_at') updatedAt!: Date;

    @relation('houses', 'house_id') house!: any;
    @relation('people', 'assigned_to_id') assignedTo!: any;
}
