import React, { useState } from 'react';
import { StyleSheet, View, ScrollView, Alert } from 'react-native';
import { TextInput, Button, Text, useTheme } from 'react-native-paper';
import type { StackScreenProps } from '@react-navigation/stack';
import { mockStore } from '../data/mockStore';

import type { Person } from '../types/person';

type RootStackParamList = {
    FamilyDashboard: undefined;
    AddPerson: { person?: Person };
};

type Props = StackScreenProps<RootStackParamList, 'AddPerson'>;

const AddPerson = ({ navigation, route }: Props) => {
    const theme = useTheme();
    const { person } = route.params || {};

    const [name, setName] = useState(person?.name || '');
    const [relation, setRelation] = useState(person?.relation || '');

    const handleSave = async () => {
        if (!name.trim()) {
            Alert.alert('Error', 'Please enter a name');
            return;
        }
        if (!relation.trim()) {
            Alert.alert('Error', 'Please enter a relation (e.g., Father, Child)');
            return;
        }

        try {
            if (person) {
                await mockStore.updatePerson(person.id, {
                    name: name.trim(),
                    relation: relation.trim(),
                });
            } else {
                await mockStore.addPerson({
                    id: Date.now().toString(),
                    name: name.trim(),
                    relation: relation.trim(),
                    isFavorite: false,
                });
            }
            navigation.goBack();
        } catch (error) {
            Alert.alert('Error', 'Failed to save person');
        }
    };

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
            <Text variant="headlineSmall" style={styles.title}>
                {person ? 'Edit Family Member' : 'Add Family Member'}
            </Text>

            <TextInput
                label="Name"
                value={name}
                onChangeText={setName}
                mode="outlined"
                style={styles.input}
                placeholder="e.g., John Doe"
            />

            <TextInput
                label="Relation"
                value={relation}
                onChangeText={setRelation}
                mode="outlined"
                style={styles.input}
                placeholder="e.g., Father, Mother, Sibling"
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
                    Save Person
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
        backgroundColor: 'white',
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

export default AddPerson;
