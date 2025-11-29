import React from 'react';
import { StyleSheet, FlatList, View, Alert } from 'react-native';
import { Card, Text, IconButton, FAB } from 'react-native-paper';
import type { InventoryItem } from '../types/inventory';

interface InventoryListProps {
    data: InventoryItem[];
    onAddItem: () => void;
    onItemPress: (item: InventoryItem) => void;
}

const InventoryList = ({ data, onAddItem, onItemPress }: InventoryListProps) => {
    const renderItem = ({ item }: { item: InventoryItem }) => (
        <Card style={styles.card} onPress={() => onItemPress(item)}>
            <Card.Title
                title={item.name}
                subtitle={`${item.category} • ${item.brand || 'Unknown Brand'}`}
                left={(props) => <IconButton {...props} icon="package-variant" />}
            />
        </Card>
    );

    return (
        <View style={styles.container}>
            <FlatList
                data={data}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.listContent}
                ListEmptyComponent={
                    <View style={styles.emptyState}>
                        <Text variant="bodyLarge" style={styles.emptyText}>No items yet. Add one!</Text>
                    </View>
                }
            />
            <FAB
                icon="barcode-scan"
                label="Add Item"
                style={styles.fab}
                onPress={onAddItem}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    listContent: {
        padding: 16,
        paddingBottom: 80, // Space for FAB
    },
    card: {
        marginBottom: 12,
        backgroundColor: 'white',
    },
    fab: {
        position: 'absolute',
        margin: 16,
        right: 0,
        bottom: 0,
    },
    emptyState: {
        padding: 40,
        alignItems: 'center',
    },
    emptyText: {
        color: 'gray',
    },
});

export default InventoryList;
