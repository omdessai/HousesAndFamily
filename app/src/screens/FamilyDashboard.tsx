import React, { useRef, useState } from 'react';
import { StyleSheet, FlatList, View, Alert, TouchableWithoutFeedback } from 'react-native';
import { FAB, Text } from 'react-native-paper';
import type { StackScreenProps } from '@react-navigation/stack';
import PersonCard from '../components/PersonCard';
import { SwipeableItemRef } from '../components/SwipeableItem';
import type { Person } from '../types/person';

import { mockStore } from '../data/mockStore';

type RootStackParamList = {
    FamilyDashboard: undefined;
};

type Props = StackScreenProps<RootStackParamList, 'FamilyDashboard'>;

const FamilyDashboard = ({ navigation }: Props) => {
    const [people, setPeople] = useState<Person[]>([]);
    const swipeableRefs = useRef<Map<string, SwipeableItemRef>>(new Map());
    const openSwipeableId = useRef<string | null>(null);

    React.useEffect(() => {
        const loadPeople = async () => {
            const data = await mockStore.getPeople();
            setPeople(data);
        };
        loadPeople();
    }, []);

    const handleDelete = (id: string) => {
        Alert.alert(
            'Delete Person',
            'Are you sure you want to delete this person?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: () => {
                        setPeople((prev) => prev.filter((p) => p.id !== id));
                    },
                },
            ]
        );
    };

    const handleToggleFavorite = (person: Person) => {
        const newFavoriteStatus = !person.isFavorite;

        // If setting to favorite, unfavorite all others (exclusive favorite logic)
        if (newFavoriteStatus) {
            setPeople((prev) =>
                prev.map((p) => ({
                    ...p,
                    isFavorite: p.id === person.id,
                }))
            );
        } else {
            // Just unfavorite this one
            setPeople((prev) =>
                prev.map((p) =>
                    p.id === person.id ? { ...p, isFavorite: false } : p
                )
            );
        }
    };

    const handleEdit = (person: Person) => {
        Alert.alert('Edit', `Edit functionality for ${person.name} coming soon!`);
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
            relation={item.relation}
            isFavorite={item.isFavorite}
            onDelete={() => handleDelete(item.id)}
            onToggleFavorite={() => handleToggleFavorite(item)}
            onEdit={() => handleEdit(item)}
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
                    onPress={() => navigation.navigate('AddPerson')}
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

export default FamilyDashboard;
