import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ScrollView, Alert } from 'react-native';
import { TextInput, Button, Text, useTheme, SegmentedButtons } from 'react-native-paper';
import type { StackScreenProps } from '@react-navigation/stack';
import type { ChoreFrequency, ChorePriority, Chore } from '../types/chore';
import type { Person } from '../types/person';
import { mockStore } from '../data/mockStore';

type RootStackParamList = {
    HouseDetails: { houseId: string };
    AddChore: { houseId: string; chore?: Chore };
};

type Props = StackScreenProps<RootStackParamList, 'AddChore'>;

const AddChore = ({ navigation, route }: Props) => {
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
                placeholder="e.g., Mow the Lawn"
            />

            <TextInput
                label="Description"
                value={description}
                onChangeText={setDescription}
                mode="outlined"
                style={styles.input}
                multiline
                numberOfLines={3}
            />

            <TextInput
                label="Due Date (YYYY-MM-DD)"
                value={dueDate}
                onChangeText={setDueDate}
                mode="outlined"
                style={styles.input}
                placeholder="YYYY-MM-DD"
            />

            <Text variant="titleSmall" style={styles.sectionTitle}>Frequency</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.scrollContainer}>
                <SegmentedButtons
                    value={frequency}
                    onValueChange={(val) => setFrequency(val as ChoreFrequency)}
                    buttons={[
                        { value: 'Once', label: 'Once' },
                        { value: 'Daily', label: 'Daily' },
                        { value: 'Weekly', label: 'Weekly' },
                        { value: 'Monthly', label: 'Monthly' },
                        { value: 'Yearly', label: 'Yearly' },
                    ]}
                    style={styles.segmentedButtons}
                />
            </ScrollView>

            <Text variant="titleSmall" style={styles.sectionTitle}>Priority</Text>
            <SegmentedButtons
                value={priority}
                onValueChange={(val) => setPriority(val as ChorePriority)}
                buttons={[
                    { value: 'Low', label: 'Low' },
                    { value: 'Medium', label: 'Medium' },
                    { value: 'High', label: 'High' },
                ]}
                style={styles.segmentedButtons}
            />

            <Text variant="titleSmall" style={styles.sectionTitle}>Assign To</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.scrollContainer}>
                {people.map((person) => (
                    <Button
                        key={person.id}
                        mode={assignedToId === person.id ? 'contained' : 'outlined'}
                        onPress={() => setAssignedToId(person.id === assignedToId ? undefined : person.id)}
                        style={styles.personButton}
                    >
                        {person.name}
                    </Button>
                ))}
            </ScrollView>

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
                    {chore ? 'Save Changes' : 'Save Chore'}
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
    sectionTitle: {
        marginTop: 8,
        marginBottom: 8,
        fontWeight: '600',
    },
    scrollContainer: {
        marginBottom: 16,
    },
    segmentedButtons: {
        marginBottom: 16,
        minWidth: '100%',
    },
    personButton: {
        marginRight: 8,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 16,
        marginTop: 24,
        marginBottom: 40,
    },
    button: {
        flex: 1,
    },
});

export default AddChore;
