import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Alert } from 'react-native';
import { Text, IconButton, useTheme, SegmentedButtons } from 'react-native-paper';
import type { StackScreenProps } from '@react-navigation/stack';
import type { House } from '../types/house';
import type { InventoryItem } from '../types/inventory';
import type { Chore } from '../types/chore';
import { mockStore } from '../data/mockStore';
import InventoryList from '../components/InventoryList';
import ChoreList from '../components/ChoreList';

type RootStackParamList = {
    HouseDetails: { house: House };
    AddItem: { houseId: string; item?: InventoryItem };
    AddChore: { houseId: string; chore?: Chore };
    AddHouse: { house: House };
};

type Props = StackScreenProps<RootStackParamList, 'HouseDetails'>;

const HouseDetails = ({ navigation, route }: Props) => {
    const { house } = route.params;
    const theme = useTheme();
    const [tab, setTab] = useState<'inventory' | 'chores'>('inventory');

    const [inventory, setInventory] = useState<InventoryItem[]>([]);
    const [chores, setChores] = useState<Chore[]>([]);

    useEffect(() => {
        const loadData = async () => {
            const inventoryData = await mockStore.getHouseInventory(house.id);
            setInventory(inventoryData);

            const choresData = await mockStore.getHouseChores(house.id);
            setChores(choresData);
        };
        loadData();
    }, [house.id]);

    const handleEditHouse = () => {
        navigation.navigate('AddHouse', { house });
    };

    const handleAddItem = () => {
        navigation.navigate('AddItem', { houseId: house.id });
    };

    const handleItemPress = (item: InventoryItem) => {
        navigation.navigate('AddItem', { houseId: house.id, item });
    };

    const handleAddChore = () => {
        navigation.navigate('AddChore', { houseId: house.id });
    };

    const handleChorePress = (chore: Chore) => {
        navigation.navigate('AddChore', { houseId: house.id, chore });
    };

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

            <View style={styles.tabContainer}>
                <SegmentedButtons
                    value={tab}
                    onValueChange={(value) => setTab(value as 'inventory' | 'chores')}
                    buttons={[
                        { value: 'inventory', label: 'Inventory', icon: 'package-variant' },
                        { value: 'chores', label: 'Chores', icon: 'checkbox-marked-circle-outline' },
                    ]}
                />
            </View>

            <View style={styles.content}>
                {tab === 'inventory' ? (
                    <InventoryList
                        data={inventory}
                        onAddItem={handleAddItem}
                        onItemPress={handleItemPress}
                    />
                ) : (
                    <ChoreList
                        data={chores}
                        onAddChore={handleAddChore}
                        onChorePress={handleChorePress}
                    />
                )}
            </View>
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
    tabContainer: {
        padding: 16,
        backgroundColor: '#f0f0f0',
    },
    content: {
        flex: 1,
    },
});

export default HouseDetails;
