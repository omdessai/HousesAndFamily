import React, { useState } from 'react';
import { StyleSheet, View, FlatList, Alert } from 'react-native';
import { Text, FAB, Card, useTheme, IconButton } from 'react-native-paper';
import type { StackScreenProps } from '@react-navigation/stack';
import type { House } from '../types/house';
import type { InventoryItem } from '../types/inventory';

// Dummy inventory data
const initialInventory: InventoryItem[] = [
    {
        id: '1',
        houseId: '1',
        name: 'Refrigerator',
        category: 'Appliance',
        brand: 'LG',
        modelNumber: 'LFXS26973S',
    },
    {
        id: '2',
        houseId: '1',
        name: 'Water Heater',
        category: 'Plumbing',
        brand: 'Rheem',
        purchaseDate: '2023-01-15',
    },
];

type RootStackParamList = {
    HouseDetails: { house: House };
    AddItem: { houseId: string };
    AddHouse: { house: House };
};

type Props = StackScreenProps<RootStackParamList, 'HouseDetails'>;

const HouseDetails = ({ navigation, route }: Props) => {
    const { house } = route.params;
    const theme = useTheme();
    const [inventory, setInventory] = useState<InventoryItem[]>(
        initialInventory.filter(item => item.houseId === house.id)
    );

    const handleEditHouse = () => {
        navigation.navigate('AddHouse', { house });
    };

    const renderItem = ({ item }: { item: InventoryItem }) => (
        <Card style={styles.card} onPress={() => Alert.alert('Item Details', `Details for ${item.name}`)}>
            <Card.Title
                title={item.name}
                subtitle={`${item.category} • ${item.brand || 'Unknown Brand'}`}
                left={(props) => <IconButton {...props} icon="package-variant" />}
            />
        </Card>
    );

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View>
                    <Text variant="headlineMedium" style={styles.houseName}>{house.name}</Text>
                    <Text variant="bodyMedium" style={styles.address}>{house.address}</Text>
                </View>
                <IconButton
                    icon="pencil"
                    mode="contained-tonal"
                    onPress={handleEditHouse}
                />
            </View>

            <View style={styles.sectionHeader}>
                <Text variant="titleLarge">Inventory</Text>
            </View>

            <FlatList
                data={inventory}
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
                onPress={() => navigation.navigate('AddItem', { houseId: house.id })}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f0f0f0',
    },
    header: {
        padding: 20,
        backgroundColor: 'white',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        elevation: 2,
    },
    houseName: {
        fontWeight: 'bold',
    },
    address: {
        color: 'gray',
        marginTop: 4,
    },
    sectionHeader: {
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 10,
    },
    listContent: {
        padding: 16,
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

export default HouseDetails;
