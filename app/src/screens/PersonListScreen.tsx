import React, { useRef, useState } from 'react';
import { StyleSheet, FlatList, View, Alert, TouchableWithoutFeedback } from 'react-native';
import { FAB, Text } from 'react-native-paper';
import type { StackScreenProps } from '@react-navigation/stack';
import PersonCard from '../components/PersonCard';
import { SwipeableItemRef } from '../components/SwipeableItem';
import { Person, storageService } from '../storage';
import { RootStackParamList } from '../navigation/AppNavigator';

type Props = StackScreenProps<RootStackParamList, 'PersonListScreen'>;

const PersonListScreen = ({ navigation }: Props) => {
    const [people, setPeople] = useState<Person[]>([]);
    const swipeableRefs = useRef<Map<string, SwipeableItemRef>>(new Map());
    const openSwipeableId = useRef<string | null>(null);

    const loadPeople = async () => {
        try {
            await storageService.initialize();
            const data = await storageService.getPersonRepository().findAll();
            setPeople(data);
        } catch (error) {
            console.error('Failed to load people:', error);
        }
    };

    React.useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            loadPeople();
        });
        return unsubscribe;
    }, [navigation]);

    const handleDelete = (id: string) => {
        Alert.alert(
            'Delete Person',
            'Are you sure you want to delete this person?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: async () => {
                        await storageService.getPersonRepository().delete(id);
                        loadPeople();
                    },
                },
            ]
        );
    };

    const handleEdit = (person: Person) => {
        navigation.navigate('PersonFormScreen', { personId: person.id });
    };

    const onSwipeableOpen = (id: string) => {
        if (openSwipeableId.current && openSwipeableId.current !== id) {
            const prevSwipeable = swipeableRefs.current.get(openSwipeableId.current);
            prevSwipeable?.close();
        }
        openSwipeableId.current = id;
    };

    const closeOpenSwipe = () => {
        if (openSwipeableId.current) {
            const swipeable = swipeableRefs.current.get(openSwipeableId.current);
            swipeable?.close();
            openSwipeableId.current = null;
        }
    };

    const renderItem = ({ item }: { item: Person }) => (
        <PersonCard
            ref={(ref) => {
                if (ref) {
                    swipeableRefs.current.set(item.id, ref);
                } else {
                    swipeableRefs.current.delete(item.id);
                }
            }}
            id={item.id}
            name={item.name}
            birthDate={item.birthDate}
            avatarUri={item.avatarUri}
            onDelete={() => handleDelete(item.id)}
            onPress={() => handleEdit(item)}
            onSwipeableOpen={() => onSwipeableOpen(item.id)}
        />
    );

    return (
        <TouchableWithoutFeedback onPress={closeOpenSwipe}>
            <View style={styles.container}>
                <FlatList
                    data={people}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={styles.listContent}
                />
                <FAB
                    icon="account-plus-outline"
                    customSize={64}
                    style={styles.fab}
                    onPress={() => navigation.navigate('PersonFormScreen', {})}
                    testID="add-person-fab"
                />
            </View>
        </TouchableWithoutFeedback>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f0f0f0',
    },
    listContent: {
        padding: 16,
    },
    fab: {
        position: 'absolute',
        margin: 16,
        right: 0,
        bottom: 0,
    },
});

export default PersonListScreen;
