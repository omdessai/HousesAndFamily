import { BaseRepository } from './BaseRepository';
import Person from '../models/Person';
import { Database } from '@nozbe/watermelondb';

export class PersonRepository extends BaseRepository<Person> {
    constructor(database: Database) {
        super('people', database);
    }

    async createPerson(data: {
        name: string;
        birthDate?: Date | null;
        avatarUri?: string | null;
    }): Promise<Person> {
        return this.create({
            name: data.name,
            birth_date: data.birthDate ?? null,
            avatar_uri: data.avatarUri ?? null,
            created_at: Date.now(),
            updated_at: Date.now(),
        });
    }

    async updatePerson(
        id: string,
        data: Partial<{
            name: string;
            birthDate: Date | null;
            avatarUri: string | null;
        }>
    ): Promise<Person> {
        const updateData: any = {};
        if (data.name !== undefined) updateData.name = data.name;
        if (data.birthDate !== undefined) updateData.birth_date = data.birthDate;
        if (data.avatarUri !== undefined) updateData.avatar_uri = data.avatarUri;
        updateData.updated_at = Date.now();

        return this.update(id, updateData);
    }
}
