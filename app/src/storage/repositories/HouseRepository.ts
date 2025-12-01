import { BaseRepository } from './BaseRepository';
import House from '../models/House';
import { Database } from '@nozbe/watermelondb';

export class HouseRepository extends BaseRepository<House> {
    constructor(database: Database) {
        super('houses', database);
    }

    async createHouse(data: {
        name: string;
        address: string;
        interest: string;
        residenceType: string;
        isFavorite?: boolean;
    }): Promise<House> {
        return this.create({
            name: data.name,
            address: data.address,
            interest: data.interest,
            residence_type: data.residenceType,
            is_favorite: data.isFavorite ?? false,
            created_at: Date.now(),
            updated_at: Date.now(),
        });
    }

    async updateHouse(
        id: string,
        data: Partial<{
            name: string;
            address: string;
            interest: string;
            residenceType: string;
            isFavorite: boolean;
        }>
    ): Promise<House> {
        const updateData: any = {};
        if (data.name !== undefined) updateData.name = data.name;
        if (data.address !== undefined) updateData.address = data.address;
        if (data.interest !== undefined) updateData.interest = data.interest;
        if (data.residenceType !== undefined) updateData.residence_type = data.residenceType;
        if (data.isFavorite !== undefined) updateData.is_favorite = data.isFavorite;
        updateData.updated_at = Date.now();

        return this.update(id, updateData);
    }

    async toggleFavorite(id: string): Promise<House> {
        return await this.database.write(async () => {
            const house = await this.getCollection().find(id);
            return await house.update((r: any) => {
                r.is_favorite = !r.is_favorite;
                r.updated_at = Date.now();
            });
        });
    }
}
