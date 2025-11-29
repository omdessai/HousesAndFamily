import React, { useState } from 'react';
import { StyleSheet, View, ScrollView, Alert } from 'react-native';
import { TextInput, Button, Text, useTheme, SegmentedButtons } from 'react-native-paper';
import type { StackScreenProps } from '@react-navigation/stack';
import type { ItemCategory } from '../types/inventory';

import { mockStore } from '../data/mockStore';
import type { InventoryItem } from '../types/inventory';

type RootStackParamList = {
    HouseDetails: { houseId: string };
    AddItem: { houseId: string; item?: InventoryItem };
};

type Props = StackScreenProps<RootStackParamList, 'AddItem'>;

const AddItem = ({ navigation, route }: Props) => {
    const { houseId, item } = route.params;
    const theme = useTheme();

    const [name, setName] = useState(item?.name || '');
    const [category, setCategory] = useState<ItemCategory>(item?.category || 'Appliance');
    const [brand, setBrand] = useState(item?.brand || '');
    const [model, setModel] = useState(item?.model || '');
    const [serial, setSerial] = useState(item?.serialNumber || '');

    const handleScanBarcode = () => {
        Alert.alert(
            'Scan Barcode',
            'Camera integration coming soon! Simulating a scan...',
            [
                {
                    text: 'Simulate Scan',
                    onPress: () => {
                        setName('Samsung Refrigerator');
                        setBrand('Samsung');
                        setModel('RF28R7351SG');
                        setCategory('Appliance');
                    }
                },
                { text: 'Cancel', style: 'cancel' }
            ]
        );
    };

    const handleSave = async () => {
        if (!name.trim()) {
            Alert.alert('Error', 'Please enter an item name');
            return;
        }

        try {
            if (item) {
                await mockStore.updateInventoryItem(item.id, {
                    name: name.trim(),
                    category,
                    brand: brand.trim(),
                    model: model.trim(),
                    serialNumber: serial.trim(),
                });
            } else {
                await mockStore.addInventoryItem({
                    id: Date.now().toString(),
                    houseId,
                    name: name.trim(),
                    category,
                    brand: brand.trim(),
                    model: model.trim(),
                    serialNumber: serial.trim(),
                    purchaseDate: new Date().toISOString(),
                });
            }
            navigation.goBack();
        } catch (error) {
            Alert.alert('Error', 'Failed to save item');
        }
    };

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
            <View style={styles.scanContainer}>
                <Button
                    mode="contained-tonal"
                    icon="barcode-scan"
                    onPress={handleScanBarcode}
                    style={styles.scanButton}
                    contentStyle={styles.scanButtonContent}
                >
                    Scan Barcode
                </Button>
                <Text variant="bodySmall" style={styles.scanHint}>
                    Scan an appliance tag to auto-fill details
                </Text>
            </View>

            <Text variant="titleMedium" style={styles.sectionTitle}>
                {item ? 'Edit Item Details' : 'Item Details'}
            </Text>

            <TextInput
                label="Item Name"
                value={name}
                onChangeText={setName}
                mode="outlined"
                style={styles.input}
                placeholder="e.g., Kitchen Fridge"
            />

            <Text variant="bodyMedium" style={styles.label}>Category</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll}>
                <SegmentedButtons
                    value={category}
                    onValueChange={(val) => setCategory(val as ItemCategory)}
                    buttons={[
                        { value: 'Appliance', label: 'Appliance' },
                        { value: 'Electrical', label: 'Electrical' },
                        { value: 'Plumbing', label: 'Plumbing' },
                        { value: 'Furniture', label: 'Furniture' },
                        { value: 'Other', label: 'Other' },
                    ]}
                    style={styles.segmentedButtons}
                />
            </ScrollView>

            <View style={styles.row}>
                <TextInput
                    label="Brand"
                    value={brand}
                    onChangeText={setBrand}
                    mode="outlined"
                    style={[styles.input, styles.halfInput]}
                />
                <TextInput
                    label="Model #"
                    value={model}
                    onChangeText={setModel}
                    mode="outlined"
                    style={[styles.input, styles.halfInput]}
                />
            </View>

            <TextInput
                label="Serial Number"
                value={serial}
                onChangeText={setSerial}
                mode="outlined"
                style={styles.input}
            />

            <View style={styles.buttonContainer}>
                <Button
                    mode="outlined"
                    onPress={() => navigation.goBack()}
                    style={styles.button}
                >
                    Cancel
                </Button>
                <Button
                    mode="contained"
                    onPress={handleSave}
                    style={styles.button}
                >
                    {item ? 'Save Changes' : 'Add Item'}
                </Button>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F5F5',
    },
    content: {
        padding: 16,
    },
    scanContainer: {
        alignItems: 'center',
        marginBottom: 24,
        padding: 16,
        backgroundColor: 'white',
        borderRadius: 12,
        elevation: 1,
    },
    scanButton: {
        width: '100%',
    },
    scanButtonContent: {
        paddingVertical: 8,
    },
    scanHint: {
        marginTop: 8,
        color: 'gray',
    },
    sectionTitle: {
        marginBottom: 16,
        fontWeight: 'bold',
    },
    input: {
        marginBottom: 16,
        backgroundColor: 'white',
    },
    label: {
        marginBottom: 8,
        fontWeight: '600',
    },
    categoryScroll: {
        marginBottom: 16,
    },
    segmentedButtons: {
        minWidth: 500, // Ensure it scrolls
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 12,
    },
    halfInput: {
        flex: 1,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 16,
        marginTop: 24,
    },
    button: {
        flex: 1,
    },
});

export default AddItem;
