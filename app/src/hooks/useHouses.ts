import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { House, CreateHouseInput, UpdateHouseInput } from '../types/house';
import { mockStore } from '../data/mockStore';

// React Query hooks
export const useHouses = () => {
    return useQuery({
        queryKey: ['houses'],
        queryFn: () => mockStore.getHouses(),
    });
};

export const useAddHouse = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (input: CreateHouseInput) => {
            const newHouse: House = {
                ...input,
                id: Date.now().toString(),
                isFavorite: false,
            };
            return mockStore.addHouse(newHouse);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['houses'] });
        },
    });
};

export const useUpdateHouse = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, input }: { id: string; input: UpdateHouseInput }) =>
            mockStore.updateHouse(id, input),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['houses'] });
        },
    });
};

export const useDeleteHouse = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => mockStore.deleteHouse(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['houses'] });
        },
    });
};
