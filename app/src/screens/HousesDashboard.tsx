import React, { useState } from 'react';
import { StyleSheet, FlatList, View, Alert } from 'react-native';
import HouseCard from '../components/HouseCard';

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
                    },
                },
            ]
        );
    };

    const handleToggleFavorite = (id: string) => {
        setHouses((prev) =>
            prev.map((h) =>
                h.id === id ? { ...h, isFavorite: !h.isFavorite } : h
            )
        );
    };

    const handleUpdateName = (id: string, newName: string) => {
        setHouses((prev) =>
            prev.map((h) => (h.id === id ? { ...h, name: newName } : h))
        );
    };

    const renderItem = ({ item }: { item: House }) => (
        <HouseCard
            id={item.id}
            initialName={item.name}
            address={item.address}
            isFavorite={item.isFavorite}
            onDelete={() => handleDelete(item.id)}
            onToggleFavorite={() => handleToggleFavorite(item.id)}
            onUpdateName={(newName) => handleUpdateName(item.id, newName)}
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
