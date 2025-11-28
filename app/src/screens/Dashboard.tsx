import React, { useState } from 'react';
import { StyleSheet, FlatList, View } from 'react-native';
import { Card, Text, Title, Paragraph } from 'react-native-paper';
import SwipeableItem from '../components/SwipeableItem';

interface House {
    id: string;
    address: string;
    price: string;
    image: string;
}

const initialHouses: House[] = [
    {
        id: '1',
        address: '123 Maple Street',
        price: '$450,000',
        image: 'https://picsum.photos/700',
    },
    {
        id: '2',
        address: '456 Oak Avenue',
        price: '$650,000',
        image: 'https://picsum.photos/701',
    },
    {
        id: '3',
        address: '789 Pine Lane',
        price: '$350,000',
        image: 'https://picsum.photos/702',
    },
    {
        id: '4',
        address: '101 Elm Road',
        price: '$550,000',
        image: 'https://picsum.photos/703',
    },
    {
        id: '5',
        address: '202 Birch Blvd',
        price: '$750,000',
        image: 'https://picsum.photos/704',
    },
];

const Dashboard = () => {
    const [houses, setHouses] = useState<House[]>(initialHouses);

    const handleDelete = (id: string) => {
        setHouses((prevHouses) => prevHouses.filter((house) => house.id !== id));
    };

    const renderItem = ({ item }: { item: House }) => (
        <View style={styles.cardContainer}>
            <SwipeableItem onDelete={() => handleDelete(item.id)}>
                <Card style={styles.card}>
                    <Card.Cover source={{ uri: item.image }} />
                    <Card.Content>
                        <Title>{item.address}</Title>
                        <Paragraph>{item.price}</Paragraph>
                    </Card.Content>
                </Card>
            </SwipeableItem>
        </View>
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
    cardContainer: {
        marginBottom: 16,
    },
    card: {
        backgroundColor: 'white',
    },
});

export default Dashboard;
