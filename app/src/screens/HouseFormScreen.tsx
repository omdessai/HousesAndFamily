import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Alert, ScrollView } from 'react-native';
import { TextInput, Button, Text, useTheme, SegmentedButtons } from 'react-native-paper';
import Geolocation from '@react-native-community/geolocation';
import type { StackScreenProps } from '@react-navigation/stack';
import { useAddHouse, useUpdateHouse } from '../hooks/useHouses';
import type { House } from '../types/house';
import { RootStackParamList } from '../navigation/AppNavigator';

type Props = StackScreenProps<RootStackParamList, 'HouseFormScreen'>;

const HouseFormScreen = ({ navigation, route }: Props) => {
    const theme = useTheme();
    const editingHouse = route.params?.house;
    const isEditMode = !!editingHouse;

    const [name, setName] = useState(editingHouse?.name || '');
    const [address, setAddress] = useState(editingHouse?.address || '');
    const [interest, setInterest] = useState<'Own' | 'Rent' | 'Wishlist'>(editingHouse?.interest || 'Own');
    const [residenceType, setResidenceType] = useState<'Primary' | 'Vacation' | 'Rental'>(
        editingHouse?.residenceType || 'Primary'
    );
    const [loading, setLoading] = useState(false);

    const addHouseMutation = useAddHouse();
    const updateHouseMutation = useUpdateHouse();

    const getCurrentLocation = () => {
        setLoading(true);
        Geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                setAddress(`${latitude.toFixed(6)}, ${longitude.toFixed(6)}`);
                setLoading(false);
            },
            (error) => {
                Alert.alert('Error', 'Unable to get location: ' + error.message);
                setLoading(false);
            },
            { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
        );
    };

    const handleSave = () => {
        if (!name.trim()) {
            Alert.alert('Error', 'Please enter a house name');
            return;
        }
        if (!address.trim()) {
            Alert.alert('Error', 'Please enter an address');
            return;
        }

        if (isEditMode && editingHouse) {
            updateHouseMutation.mutate(
                {
                    id: editingHouse.id,
                    input: {
                        name: name.trim(),
                        address: address.trim(),
                        interest,
                        residenceType,
                    },
                },
                {
                    onSuccess: () => {
                        navigation.goBack();
                    },
                    onError: (error) => {
                        Alert.alert('Error', 'Failed to update house: ' + error.message);
                    },
                }
            );
        } else {
            addHouseMutation.mutate(
                {
                    name: name.trim(),
                    address: address.trim(),
                    interest,
                    residenceType,
                },
                {
                    onSuccess: () => {
                        navigation.goBack();
                    },
                    onError: (error) => {
                        Alert.alert('Error', 'Failed to add house: ' + error.message);
                    },
                }
            );
        }
    };

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
            <Text variant="headlineSmall" style={[styles.title, { color: theme.colors.onSurface }]}>
                {isEditMode ? 'Edit House' : 'Add New House'}
            </Text>

            <TextInput
                label="House Name"
                value={name}
                onChangeText={setName}
                mode="outlined"
                style={styles.input}
                placeholder="e.g., My Sweet Home"
                testID="house-name-input"
            />

            <TextInput
                label="Address"
                value={address}
                onChangeText={setAddress}
                mode="outlined"
                style={styles.input}
                placeholder="e.g., 123 Main St, City"
                multiline
                numberOfLines={3}
                testID="house-address-input"
            />

            <Button
                mode="outlined"
                onPress={getCurrentLocation}
                loading={loading}
                disabled={loading}
                style={styles.locationButton}
                icon="map-marker"
            >
                Use Current Location
            </Button>

            <Text variant="titleSmall" style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>
                Interest
            </Text>
            <SegmentedButtons
                value={interest}
                onValueChange={(value) => setInterest(value as 'Own' | 'Rent' | 'Wishlist')}
                buttons={[
                    { value: 'Own', label: 'Own' },
                    { value: 'Rent', label: 'Rent' },
                    { value: 'Wishlist', label: 'Wishlist' },
                ]}
                style={styles.segmentedButtons}
            />

            <Text variant="titleSmall" style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>
                Residence Type
            </Text>
            <SegmentedButtons
                value={residenceType}
                onValueChange={(value) => setResidenceType(value as 'Primary' | 'Vacation' | 'Rental')}
                buttons={[
                    { value: 'Primary', label: 'Primary' },
                    { value: 'Vacation', label: 'Vacation' },
                    { value: 'Rental', label: 'Rental' },
                ]}
                style={styles.segmentedButtons}
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
                    loading={addHouseMutation.isPending || updateHouseMutation.isPending}
                    disabled={addHouseMutation.isPending || updateHouseMutation.isPending}
                    testID="save-house-button"
                >
                    {isEditMode ? 'Update' : 'Save'}
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
    title: {
        marginBottom: 24,
        fontWeight: 'bold',
    },
    input: {
        marginBottom: 16,
    },
    locationButton: {
        marginBottom: 24,
    },
    sectionTitle: {
        marginBottom: 8,
        fontWeight: '600',
    },
    segmentedButtons: {
        marginBottom: 24,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 16,
        marginTop: 8,
    },
    button: {
        flex: 1,
    },
});

export default HouseFormScreen;
