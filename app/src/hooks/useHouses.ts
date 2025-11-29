import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { House, CreateHouseInput, UpdateHouseInput } from '../types/house';

// In-memory storage (replace with actual API calls later)
let housesStore: House[] = [
    {
        id: '1',
        name: 'My Sweet Home',
        address: '123 Maple Street, Springfield',
        interest: 'Own',
        residenceType: 'Primary',
        isFavorite: false,
    },
    {
        id: '2',
        name: 'Vacation House',
        address: '456 Beach Blvd, Miami',
        interest: 'Own',
        residenceType: 'Vacation',
        isFavorite: false,
    },
    {
        id: '3',
        name: 'Rental Property',
        address: '789 City Center, New York',
        interest: 'Rent',
        residenceType: 'Rental',
        isFavorite: false,
    },
];

// Simulated API functions
const fetchHouses = async (): Promise<House[]> => {
    return new Promise((resolve) => {
        setTimeout(() => resolve([...housesStore]), 100);
    });
};

const addHouse = async (input: CreateHouseInput): Promise<House> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            const newHouse: House = {
                ...input,
                id: Date.now().toString(),
                isFavorite: false,
            };
            housesStore.push(newHouse);
            resolve(newHouse);
        }, 100);
    });
};

const updateHouse = async (id: string, input: UpdateHouseInput): Promise<House> => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const index = housesStore.findIndex((h) => h.id === id);
            if (index === -1) {
                reject(new Error('House not found'));
                return;
            }
            housesStore[index] = { ...housesStore[index], ...input };
            resolve(housesStore[index]);
        }, 100);
    });
};

const deleteHouse = async (id: string): Promise<void> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            housesStore = housesStore.filter((h) => h.id !== id);
            resolve();
        }, 100);
    });
};

// React Query hooks
export const useHouses = () => {
    return useQuery({
        queryKey: ['houses'],
        queryFn: fetchHouses,
    });
};

export const useAddHouse = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: addHouse,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['houses'] });
        },
    });
};

export const useUpdateHouse = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, input }: { id: string; input: UpdateHouseInput }) =>
            updateHouse(id, input),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['houses'] });
        },
    });
};

export const useDeleteHouse = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deleteHouse,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['houses'] });
        },
    });
};
