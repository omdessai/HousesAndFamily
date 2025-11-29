export interface House {
    id: string;
    name: string;
    address: string;
    interest: 'Own' | 'Rent' | 'Wishlist';
    residenceType: 'Primary' | 'Vacation' | 'Rental';
    isFavorite: boolean;
}

export type CreateHouseInput = Omit<House, 'id' | 'isFavorite'>;
export type UpdateHouseInput = Partial<Omit<House, 'id'>>;
