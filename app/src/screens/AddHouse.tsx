import React, { useState } from 'react';
import { StyleSheet, View, Alert, ScrollView } from 'react-native';
import { TextInput, Button, Text, useTheme } from 'react-native-paper';
import Geolocation from '@react-native-community/geolocation';
import type { StackScreenProps } from '@react-navigation/stack';

type RootStackParamList = {
    HousesDashboard: { newHouse?: { id: string; name: string; address: string; isFavorite: boolean } };
    AddHouse: undefined;
};

type Props = StackScreenProps<RootStackParamList, 'AddHouse'>;

const AddHouse = ({ navigation }: Props) => {
    const theme = useTheme();
    const [name, setName] = useState('');
    const [address, setAddress] = useState('');
    const [loading, setLoading] = useState(false);

    const getCurrentLocation = () => {
        setLoading(true);
        Geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                // In a real app, you would use a geocoding service to convert coordinates to an address
                // For now, we'll just show the coordinates
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

        const newHouse = {
            id: Date.now().toString(),
            name: name.trim(),
            address: address.trim(),
            isFavorite: false,
        };

        navigation.navigate('HousesDashboard', { newHouse });
    };

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
            <Text variant="headlineSmall" style={[styles.title, { color: theme.colors.onSurface }]}>
                Add New House
            </Text>

            <TextInput
                label="House Name"
                value={name}
                onChangeText={setName}
                mode="outlined"
                style={styles.input}
                placeholder="e.g., My Sweet Home"
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
                    Save
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
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 16,
    },
    button: {
        flex: 1,
    },
});

export default AddHouse;
