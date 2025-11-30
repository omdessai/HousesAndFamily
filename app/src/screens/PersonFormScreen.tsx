import React, { useState } from 'react';
import { StyleSheet, View, ScrollView, Alert, Platform, TouchableOpacity, Modal } from 'react-native';
import { TextInput, Button, Text, useTheme } from 'react-native-paper';
import type { StackScreenProps } from '@react-navigation/stack';
import DateTimePicker from '@react-native-community/datetimepicker';
import { storageService, imageStorage } from '../storage';
import EditableAvatar from '../components/EditableAvatar';

import { RootStackParamList } from '../navigation/AppNavigator';

type Props = StackScreenProps<RootStackParamList, 'PersonFormScreen'>;

const PersonFormScreen = ({ navigation, route }: Props) => {
    const theme = useTheme();
    const { personId } = route.params || {};

    const [name, setName] = useState('');
    const [birthDate, setBirthDate] = useState<Date | null>(null);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [avatarUri, setAvatarUri] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(!!personId);

    React.useEffect(() => {
        const loadPerson = async () => {
            if (personId) {
                try {
                    await storageService.initialize();
                    const person = await storageService.getPersonRepository().findById(personId);
                    if (person) {
                        setName(person.name);
                        setBirthDate(person.birthDate ? new Date(person.birthDate) : null);
                        setAvatarUri(person.avatarUri || null);
                    }
                } catch (error) {
                    console.error('Failed to load person:', error);
                    Alert.alert('Error', 'Failed to load person details');
                    navigation.goBack();
                } finally {
                    setIsLoading(false);
                }
            }
        };
        loadPerson();
    }, [personId, navigation]);



    const handleSave = async () => {
        if (!name.trim()) {
            Alert.alert('Error', 'Please enter a name');
            return;
        }

        let parsedDate: Date | null = birthDate;

        try {
            await storageService.initialize();

            let finalAvatarUri = avatarUri;
            // If avatar is a local file (newly selected), save it to permanent storage
            if (avatarUri && !avatarUri.includes('Documents/images')) {
                if (!personId || (personId && avatarUri !== (await storageService.getPersonRepository().findById(personId))?.avatarUri)) {
                    finalAvatarUri = await imageStorage.saveImage(
                        Date.now().toString(),
                        avatarUri,
                        'person'
                    );
                }
            }

            if (personId) {
                await storageService.getPersonRepository().updatePerson(personId, {
                    name: name.trim(),
                    birthDate: parsedDate,
                    avatarUri: finalAvatarUri,
                });
            } else {
                await storageService.getPersonRepository().createPerson({
                    name: name.trim(),
                    birthDate: parsedDate,
                    avatarUri: finalAvatarUri,
                });
            }
            navigation.goBack();
        } catch (error) {
            Alert.alert('Error', 'Failed to save person');
            console.error(error);
        }
    };

    if (isLoading) {
        return (
            <View style={[styles.container, styles.loadingContainer]}>
                <Text>Loading...</Text>
            </View>
        );
    }

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
            <Text variant="headlineSmall" style={styles.title}>
                {personId ? 'Edit Person' : 'Add Person'}
            </Text>

            <EditableAvatar
                avatarUri={avatarUri}
                onAvatarChange={setAvatarUri}
                size={100}
            />

            <TextInput
                label="Name"
                value={name}
                onChangeText={setName}
                mode="outlined"
                style={styles.input}
                placeholder="e.g., John Doe"
                testID="person-name-input"
            />

            <TouchableOpacity onPress={() => setShowDatePicker(true)}>
                <View pointerEvents="none">
                    <TextInput
                        label="Birth Date"
                        value={birthDate ? birthDate.toLocaleDateString() : ''}
                        mode="outlined"
                        style={styles.input}
                        editable={false}
                        right={<TextInput.Icon icon="calendar" />}
                        testID="person-birthdate-input"
                    />
                </View>
            </TouchableOpacity>

            {showDatePicker && (
                Platform.OS === 'ios' ? (
                    <Modal
                        transparent={true}
                        animationType="slide"
                        visible={showDatePicker}
                        onRequestClose={() => setShowDatePicker(false)}
                    >
                        <View style={styles.modalContainer}>
                            <View style={styles.modalContent}>
                                <View style={styles.modalHeader}>
                                    <Button onPress={() => setShowDatePicker(false)}>Cancel</Button>
                                    <Button onPress={() => setShowDatePicker(false)}>Done</Button>
                                </View>
                                <DateTimePicker
                                    value={birthDate || new Date()}
                                    mode="date"
                                    display="inline"
                                    onChange={(event, selectedDate) => {
                                        if (selectedDate) {
                                            setBirthDate(selectedDate);
                                        }
                                    }}
                                    maximumDate={new Date()}
                                    style={styles.datePicker}
                                />
                            </View>
                        </View>
                    </Modal>
                ) : (
                    <DateTimePicker
                        value={birthDate || new Date()}
                        mode="date"
                        display="default"
                        onChange={(event, selectedDate) => {
                            setShowDatePicker(false);
                            if (selectedDate) {
                                setBirthDate(selectedDate);
                            }
                        }}
                        maximumDate={new Date()}
                    />
                )
            )}

            <Button mode="contained" onPress={handleSave} style={styles.button} testID="save-person-button">
                {personId ? 'Update Person' : 'Save Person'}
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
        textAlign: 'center',
    },
    input: {
        marginBottom: 16,
        backgroundColor: 'white',
    },
    button: {
        marginTop: 8,
    },
    loadingContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: 'white',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        paddingBottom: 20,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    datePicker: {
        height: 300,
    },
});

export default PersonFormScreen;
