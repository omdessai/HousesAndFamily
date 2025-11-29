import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, FlatList, View, Alert, TouchableWithoutFeedback } from 'react-native';
import { FAB } from 'react-native-paper';
import type { StackScreenProps } from '@react-navigation/stack';
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
        isFavorite: false,
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

type RootStackParamList = {
    HousesDashboard: { newHouse?: { id: string; name: string; address: string; isFavorite: boolean } };
    AddHouse: undefined;
};

type Props = StackScreenProps<RootStackParamList, 'HousesDashboard'>;

const HousesDashboard = ({ navigation, route }: Props) => {
    const [houses, setHouses] = useState<House[]>(initialHouses);
    const swipeableRefs = useRef<Map<string, SwipeableItemRef>>(new Map());
    const openSwipeableId = useRef<string | null>(null);

    useEffect(() => {
        if (route.params?.newHouse) {
            setHouses((prev) => [...prev, route.params.newHouse!]);
        }
    }, [route.params?.newHouse]);

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

    const closeOpenSwipe = () => {
        if (openSwipeableId.current) {
            const swipeable = swipeableRefs.current.get(openSwipeableId.current);
            swipeable?.close();
            openSwipeableId.current = null;
        }
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
        <TouchableWithoutFeedback onPress={closeOpenSwipe}>
            <View style={styles.container}>
                <FlatList
                    data={houses}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={styles.listContent}
                />
                <FAB
                    icon="home-plus"
                    style={styles.fab}
                    onPress={() => navigation.navigate('AddHouse')}
                    testID="add-house-fab"
                />
            </View>
        </TouchableWithoutFeedback>
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
    fab: {
        position: 'absolute',
        margin: 16,
        right: 0,
        bottom: 0,
    },
});

export default HousesDashboard;
