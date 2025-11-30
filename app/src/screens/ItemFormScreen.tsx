import React, { useState } from 'react';
import CameraScreen from 'react-native-camera-kit';
import { StyleSheet, View, ScrollView, Alert, Modal, Platform, PermissionsAndroid } from 'react-native';
import { TextInput, Button, Text, useTheme, SegmentedButtons } from 'react-native-paper';
import type { StackScreenProps } from '@react-navigation/stack';
import type { ItemCategory } from '../types/inventory';

import { mockStore } from '../data/mockStore';
import type { InventoryItem } from '../types/inventory';
import { RootStackParamList } from '../navigation/AppNavigator';

type Props = StackScreenProps<RootStackParamList, 'ItemFormScreen'>;

const ItemFormScreen = ({ navigation, route }: Props) => {
    const { houseId, item } = route.params;
    const theme = useTheme();

    const [name, setName] = useState(item?.name || '');
    const [category, setCategory] = useState<ItemCategory>(item?.category || 'Appliance');
    const [brand, setBrand] = useState(item?.brand || '');
    const [modelNumber, setModelNumber] = useState(item?.modelNumber || '');
    const [serial, setSerial] = useState(item?.serialNumber || '');
    const [purchaseDate, setPurchaseDate] = useState(item?.purchaseDate || '');
    const [purchasePrice, setPurchasePrice] = useState(item?.purchasePrice?.toString() || '');
    const [showScanner, setShowScanner] = useState(false);

    const requestCameraPermission = async () => {
        if (Platform.OS === 'android') {
            try {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.CAMERA,
                    {
                        title: 'Camera Permission',
                        message: 'App needs access to your camera to scan barcodes.',
                        buttonNeutral: 'Ask Me Later',
                        buttonNegative: 'Cancel',
                        buttonPositive: 'OK',
                    }
                );
                return granted === PermissionsAndroid.RESULTS.GRANTED;
            } catch (err) {
                console.warn(err);
                return false;
            }
        }
        return true;
    };

    const handleScanBarcode = async () => {
        // On iOS, always use manual entry (simulator doesn't support camera)
        // On Android, try to use camera (works on real devices)
        if (Platform.OS === 'ios') {
            // Fallback for simulator - manual entry
            Alert.prompt(
                'Enter Barcode',
                'Enter a barcode manually (camera requires physical device):',
                (code) => {
                    if (code && code.trim()) {
                        simulateBarcodeLookup(code.trim());
                    }
                },
                'plain-text',
                '',
                'numeric'
            );
        } else {
            const hasPermission = await requestCameraPermission();
            if (hasPermission) {
                setShowScanner(true);
            } else {
                Alert.alert('Permission Denied', 'Camera permission is required to scan barcodes.');
            }
        }
    };

    const simulateBarcodeLookup = (code: string) => {
        Alert.alert('Barcode Processed', `Code: ${code}\n\nSimulating product lookup...`);

        // Simulate lookup
        setName('Scanned Item ' + code.substring(0, 4));
        setBrand('Generic Brand');
        setModelNumber(code);
        setCategory('Appliance');
    };

    const onBarcodeScan = (event: any) => {
        const code = event.nativeEvent.codeStringValue;
        setShowScanner(false);
        simulateBarcodeLookup(code);
    };

    const handleSave = async () => {
        if (!name.trim()) {
            Alert.alert('Error', 'Please enter an item name');
            return;
        }

        const price = purchasePrice ? parseFloat(purchasePrice) : undefined;

        try {
            if (item) {
                await mockStore.updateInventoryItem(item.id, {
                    name: name.trim(),
                    category,
                    brand: brand.trim(),
                    modelNumber: modelNumber.trim(),
                    serialNumber: serial.trim(),
                    purchaseDate: purchaseDate.trim(),
                    purchasePrice: price,
                });
            } else {
                await mockStore.addInventoryItem({
                    id: Date.now().toString(),
                    houseId,
                    name: name.trim(),
                    category,
                    brand: brand.trim(),
                    modelNumber: modelNumber.trim(),
                    serialNumber: serial.trim(),
                    purchaseDate: purchaseDate.trim() || new Date().toISOString(),
                    purchasePrice: price,
                });
            }
            navigation.goBack();
        } catch (error) {
            Alert.alert('Error', 'Failed to save item');
        }
    };

    return (
        <>
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
                />
                <TextInput
                    label="Category"
                    value={category}
                    onChangeText={(text) => setCategory(text as ItemCategory)}
                    style={styles.input}
                />
                <TextInput
                    label="Brand"
                    value={brand}
                    onChangeText={setBrand}
                    style={styles.input}
                />
                <TextInput
                    label="Model"
                    value={modelNumber}
                    onChangeText={setModelNumber}
                    style={styles.input}
                />
                <TextInput
                    label="Serial Number"
                    value={serial}
                    onChangeText={setSerial}
                    style={styles.input}
                />
                <TextInput
                    label="Purchase Date"
                    value={purchaseDate}
                    onChangeText={setPurchaseDate}
                    style={styles.input}
                    placeholder="YYYY-MM-DD"
                />
                <TextInput
                    label="Purchase Price"
                    value={purchasePrice}
                    onChangeText={setPurchasePrice}
                    keyboardType="numeric"
                    style={styles.input}
                    left={<TextInput.Affix text="$" />}
                />

                <Button mode="contained" onPress={handleSave} style={styles.button}>
                    {item ? 'Update Item' : 'Save Item'}
                </Button>
            </ScrollView>

            <Modal
                visible={showScanner}
                animationType="slide"
                onRequestClose={() => setShowScanner(false)}
            >
                <View style={styles.scannerContainer}>
                    <CameraScreen
                        scanBarcode={true}
                        onReadCode={onBarcodeScan}
                        showFrame={true}
                        laserColor="red"
                        frameColor="white"
                    />
                    <Button
                        mode="contained"
                        onPress={() => setShowScanner(false)}
                        style={styles.closeScannerButton}
                    >
                        Close Scanner
                    </Button>
                </View>
            </Modal>
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: 'white',
    },
    content: {
        paddingBottom: 40,
    },
    scanContainer: {
        marginBottom: 20,
        alignItems: 'center',
        padding: 16,
        backgroundColor: '#f5f5f5',
        borderRadius: 8,
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
    button: {
        marginTop: 8,
    },
    scannerContainer: {
        flex: 1,
        backgroundColor: 'black',
    },
    closeScannerButton: {
        position: 'absolute',
        bottom: 50,
        alignSelf: 'center',
        width: 200,
    },
});

export default ItemFormScreen;
