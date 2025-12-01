import { BaseRepository } from './BaseRepository';
import Chore from '../models/Chore';
import { Database, Q } from '@nozbe/watermelondb';

export class ChoreRepository extends BaseRepository<Chore> {
    constructor(database: Database) {
        super('chores', database);
    }

    async createChore(data: {
        houseId: string;
        title: string;
        frequency: string;
        priority: string;
        description?: string | null;
        dueDate?: string | null;
        assignedToId?: string | null;
    }): Promise<Chore> {
        return this.create({
            house_id: data.houseId,
            title: data.title,
            frequency: data.frequency,
            priority: data.priority,
            description: data.description ?? null,
            due_date: data.dueDate ?? null,
            assigned_to_id: data.assignedToId ?? null,
            is_completed: false,
            created_at: Date.now(),
            updated_at: Date.now(),
        });
    }

    async updateChore(
        id: string,
        data: Partial<{
            title: string;
            description: string | null;
            dueDate: string | null;
            frequency: string;
            priority: string;
            assignedToId: string | null;
            isCompleted: boolean;
            completedAt: string | null;
        }>
    ): Promise<Chore> {
        const updateData: any = {};
        if (data.title !== undefined) updateData.title = data.title;
        if (data.description !== undefined) updateData.description = data.description;
        if (data.dueDate !== undefined) updateData.due_date = data.dueDate;
        if (data.frequency !== undefined) updateData.frequency = data.frequency;
        if (data.priority !== undefined) updateData.priority = data.priority;
        if (data.assignedToId !== undefined) updateData.assigned_to_id = data.assignedToId;
        if (data.isCompleted !== undefined) updateData.is_completed = data.isCompleted;
        if (data.completedAt !== undefined) updateData.completed_at = data.completedAt;
        updateData.updated_at = Date.now();

        return this.update(id, updateData);
    }

    async toggleComplete(id: string): Promise<Chore> {
        return await this.database.write(async () => {
            const chore = await this.getCollection().find(id);
            const isCompleted = !chore.isCompleted;
            return await chore.update((r: any) => {
                r.is_completed = isCompleted;
                r.completed_at = isCompleted ? new Date().toISOString() : null;
                r.updated_at = Date.now();
            });
        });
    }

    async getChoresForHouse(houseId: string): Promise<Chore[]> {
        return await this.getCollection().query(Q.where('house_id', houseId)).fetch();
    }
}
