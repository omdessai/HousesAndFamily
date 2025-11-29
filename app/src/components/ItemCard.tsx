import React from 'react';
import { StyleSheet, Alert } from 'react-native';
import { Card, IconButton } from 'react-native-paper';
import type { InventoryItem } from '../types/inventory';

interface ItemCardProps {
    item: InventoryItem;
    onPress: () => void;
}

const ItemCard = ({ item, onPress }: ItemCardProps) => {
    return (
        <Card style={styles.card} onPress={onPress}>
            <Card.Title
                title={item.name}
                subtitle={`${item.category} • ${item.brand || 'Unknown Brand'}`}
                left={(props) => <IconButton {...props} icon="package-variant" />}
            />
        </Card>
    );
};

const styles = StyleSheet.create({
    card: {
        marginBottom: 12,
        backgroundColor: 'white',
    },
});

export default ItemCard;
