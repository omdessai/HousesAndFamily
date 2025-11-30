import React, { useState } from 'react';
import { StyleSheet, View, ScrollView, Alert, Image, TouchableOpacity } from 'react-native';
import { TextInput, Button, Text, useTheme, Avatar } from 'react-native-paper';
import type { StackScreenProps } from '@react-navigation/stack';
import { launchImageLibrary } from 'react-native-image-picker';
import { storageService, imageStorage } from '../storage';

import { RootStackParamList } from '../navigation/AppNavigator';

type Props = StackScreenProps<RootStackParamList, 'PersonFormScreen'>;

const PersonFormScreen = ({ navigation, route }: Props) => {
    const theme = useTheme();
    const { personId } = route.params || {};

    const [name, setName] = useState('');
    const [birthDate, setBirthDate] = useState('');
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
                        setBirthDate(person.birthDate ? new Date(person.birthDate).toISOString().split('T')[0] : '');
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

    const handleSelectPhoto = async () => {
        const result = await launchImageLibrary({
            mediaType: 'photo',
            quality: 0.8,
        });

        if (result.assets && result.assets.length > 0 && result.assets[0].uri) {
            setAvatarUri(result.assets[0].uri);
        }
    };

    const handleSave = async () => {
        if (!name.trim()) {
            Alert.alert('Error', 'Please enter a name');
            return;
        }

        let parsedDate: Date | null = null;
        if (birthDate.trim()) {
            const timestamp = Date.parse(birthDate);
            if (isNaN(timestamp)) {
                Alert.alert('Error', 'Invalid date format. Use YYYY-MM-DD');
                return;
            }
            parsedDate = new Date(timestamp);
        }

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

            <View style={styles.avatarContainer}>
                <TouchableOpacity onPress={handleSelectPhoto}>
                    {avatarUri ? (
                        <Avatar.Image size={100} source={{ uri: avatarUri }} />
                    ) : (
                        <Avatar.Icon size={100} icon="camera" />
                    )}
                </TouchableOpacity>
                <Button mode="text" onPress={handleSelectPhoto}>
                    {avatarUri ? 'Change Photo' : 'Add Photo'}
                </Button>
            </View>

            <TextInput
                label="Name"
                value={name}
                onChangeText={setName}
                mode="outlined"
                style={styles.input}
                placeholder="e.g., John Doe"
                testID="person-name-input"
            />

            <TextInput
                label="Birth Date (YYYY-MM-DD)"
                value={birthDate}
                onChangeText={setBirthDate}
                mode="outlined"
                style={styles.input}
                placeholder="YYYY-MM-DD"
                testID="person-birthdate-input"
            />

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
    avatarContainer: {
        alignItems: 'center',
        marginBottom: 24,
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
});

export default PersonFormScreen;
