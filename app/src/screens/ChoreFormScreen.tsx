import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ScrollView, Alert } from 'react-native';
import { TextInput, Button, Text, useTheme, SegmentedButtons } from 'react-native-paper';
import type { StackScreenProps } from '@react-navigation/stack';
import type { ChoreFrequency, ChorePriority, Chore } from '../types/chore';
import type { Person } from '../types/person';
import { mockStore } from '../data/mockStore';
import { RootStackParamList } from '../navigation/AppNavigator';

type Props = StackScreenProps<RootStackParamList, 'ChoreFormScreen'>;

const ChoreFormScreen = ({ navigation, route }: Props) => {
    const { houseId, chore } = route.params;
    const theme = useTheme();

    const [title, setTitle] = useState(chore?.title || '');
    const [description, setDescription] = useState(chore?.description || '');
    const [dueDate, setDueDate] = useState(chore?.dueDate ? new Date(chore.dueDate) : new Date());
    const [frequency, setFrequency] = useState<ChoreFrequency>(chore?.frequency || 'Weekly');
    const [priority, setPriority] = useState<ChorePriority>(chore?.priority || 'Medium');
    const [assignedToId, setAssignedToId] = useState<string | undefined>(chore?.assignedToId);
    const [showDatePicker, setShowDatePicker] = useState(false);

    const [people, setPeople] = useState<Person[]>([]);

    useEffect(() => {
        const loadPeople = async () => {
            const data = await mockStore.getPeople();
            setPeople(data);
        };
        loadPeople();
    }, []);

    const handleSave = async () => {
        if (!title.trim()) {
            Alert.alert('Error', 'Please enter a chore title');
            return;
        }

        try {
            if (chore) {
                await mockStore.updateChore(chore.id, {
                    title: title.trim(),
                    description: description.trim(),
                    frequency,
                    priority,
                    assignedToId: assignedToId || undefined,
                    dueDate: dueDate.toISOString(),
                });
            } else {
                await mockStore.addChore({
                    id: Date.now().toString(),
                    houseId,
                    title: title.trim(),
                    description: description.trim(),
                    frequency,
                    priority,
                    status: 'Pending',
                    assignedToId: assignedToId || undefined,
                    dueDate: dueDate.toISOString(),
                });
            }
            navigation.goBack();
        } catch (error) {
            Alert.alert('Error', 'Failed to save chore');
        }
    };

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
            <Text variant="headlineSmall" style={styles.title}>
                {chore ? 'Edit Chore' : 'Add New Chore'}
            </Text>

            <TextInput
                label="Title"
                value={title}
                onChangeText={setTitle}
                mode="outlined"
                style={styles.input}
            />
            <TextInput
                label="Description"
                value={description}
                onChangeText={setDescription}
                multiline
                numberOfLines={3}
                style={styles.input}
            />

            <Text variant="titleMedium" style={styles.label}>Frequency</Text>
            <SegmentedButtons
                value={frequency}
                onValueChange={(value) => setFrequency(value as 'Daily' | 'Weekly' | 'Monthly')}
                buttons={[
                    { value: 'Daily', label: 'Daily' },
                    { value: 'Weekly', label: 'Weekly' },
                    { value: 'Monthly', label: 'Monthly' },
                ]}
                style={styles.segmentedButton}
            />

            <Text variant="titleMedium" style={styles.label}>Priority</Text>
            <SegmentedButtons
                value={priority}
                onValueChange={(value) => setPriority(value as 'Low' | 'Medium' | 'High')}
                buttons={[
                    { value: 'Low', label: 'Low' },
                    { value: 'Medium', label: 'Medium' },
                    { value: 'High', label: 'High' },
                ]}
                style={styles.segmentedButton}
            />

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
                {chore ? 'Save Changes' : 'Save Chore'}
            </Button>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    content: {
        padding: 20,
    },
    title: {
        marginBottom: 24,
        fontWeight: 'bold',
    },
    input: {
        marginBottom: 16,
        backgroundColor: 'white',
    },
    label: {
        marginTop: 8,
        marginBottom: 8,
        fontWeight: '600',
    },
    segmentedButton: {
        marginBottom: 16,
    },
    button: {
        marginTop: 16,
        marginBottom: 32,
    },
});

export default ChoreFormScreen;
