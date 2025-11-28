import React, { useState, useRef } from 'react';
import { StyleSheet, FlatList, View, Alert } from 'react-native';
import HouseCard from '../components/HouseCard';
import { SwipeableItemRef } from '../components/SwipeableItem';

interface House {
    id: string;
    name: string;
    address: string;
    isFavorite: boolean;
}

const initialHouses: House[] = [
    {
        id: '1',
        name: 'My Sweet Home',
        address: '123 Maple Street, Springfield',
        isFavorite: true,
    },
    {
        id: '2',
        name: 'Vacation House',
        address: '456 Beach Blvd, Miami',
        isFavorite: false,
    },
    {
        id: '3',
        name: 'Rental Property',
        address: '789 City Center, New York',
        isFavorite: false,
    },
];

const HousesDashboard = () => {
    const [houses, setHouses] = useState<House[]>(initialHouses);
    const swipeableRefs = useRef<Map<string, SwipeableItemRef>>(new Map());
    const openSwipeableId = useRef<string | null>(null);

    const handleDelete = (id: string) => {
        Alert.alert(
            'Delete House',
            'Are you sure you want to delete this house?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: () => {
                        setHouses((prev) => prev.filter((h) => h.id !== id));
                        swipeableRefs.current.delete(id);
                    },
                },
            ]
        );
    };

    const handleToggleFavorite = (id: string) => {
        setHouses((prev) =>
            prev.map((h) => {
                if (h.id === id) {
                    return { ...h, isFavorite: !h.isFavorite };
                }
                // If we are setting the clicked house to favorite, unset others
                // If we are unsetting the clicked house, others remain as is (false)
                // However, the logic "Only one... can be marked" implies if I mark A, B becomes unmarked.
                // If I unmark A, no one is marked.
                // To implement this: if h.id === id becomes true, all others must be false.
                // But we don't know the *new* state of h.id yet in this map without checking current state.
                return h;
            })
        );

        // Better approach:
        setHouses((prev) => {
            const house = prev.find((h) => h.id === id);
            if (!house) return prev;

            const newFavoriteStatus = !house.isFavorite;

            if (newFavoriteStatus) {
                // If turning ON, turn off all others
                return prev.map((h) => ({
                    ...h,
                    isFavorite: h.id === id,
                }));
            } else {
                // If turning OFF, just turn off this one
                return prev.map((h) =>
                    h.id === id ? { ...h, isFavorite: false } : h
                );
            }
        });
    };

    const handleUpdateName = (id: string, newName: string) => {
        setHouses((prev) =>
            prev.map((h) => (h.id === id ? { ...h, name: newName } : h))
        );
    };

    const onSwipeableOpen = (id: string) => {
        if (openSwipeableId.current && openSwipeableId.current !== id) {
            const prevSwipeable = swipeableRefs.current.get(openSwipeableId.current);
            prevSwipeable?.close();
        }
        openSwipeableId.current = id;
    };

    const renderItem = ({ item }: { item: House }) => (
        <HouseCard
            ref={(ref) => {
                if (ref) {
                    swipeableRefs.current.set(item.id, ref);
                } else {
                    swipeableRefs.current.delete(item.id);
                }
            }}
            id={item.id}
            initialName={item.name}
            address={item.address}
            isFavorite={item.isFavorite}
            onDelete={() => handleDelete(item.id)}
            onToggleFavorite={() => handleToggleFavorite(item.id)}
            onUpdateName={(newName) => handleUpdateName(item.id, newName)}
            onSwipeableOpen={() => onSwipeableOpen(item.id)}
        />
    );

    return (
        <View style={styles.container}>
            <FlatList
                data={houses}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.listContent}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f0f0f0',
    },
    listContent: {
        padding: 16,
    },
});

export default HousesDashboard;
