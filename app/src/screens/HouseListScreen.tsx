import React, { useRef } from 'react';
import { StyleSheet, FlatList, View, Alert, TouchableWithoutFeedback, ActivityIndicator } from 'react-native';
import { FAB, Text } from 'react-native-paper';
import type { StackScreenProps } from '@react-navigation/stack';
import HouseCard from '../components/HouseCard';
import { SwipeableItemRef } from '../components/SwipeableItem';
import { useHouses, useDeleteHouse, useUpdateHouse } from '../hooks/useHouses';
import type { House } from '../types/house';
import { RootStackParamList } from '../navigation/AppNavigator';

type Props = StackScreenProps<RootStackParamList, 'HouseListScreen'>;

const HouseListScreen = ({ navigation }: Props) => {
    const { data: houses, isLoading, error } = useHouses();
    const deleteHouseMutation = useDeleteHouse();
    const updateHouseMutation = useUpdateHouse();

    const swipeableRefs = useRef<Map<string, SwipeableItemRef>>(new Map());
    const openSwipeableId = useRef<string | null>(null);

    const handleDelete = (id: string) => {
        Alert.alert(
            'Delete House',
            'Are you sure you want to delete this house?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: () => {
                        deleteHouseMutation.mutate(id);
                    },
                },
            ]
        );
    };

    const handleToggleFavorite = (house: House) => {
        const newFavoriteStatus = !house.isFavorite;

        updateHouseMutation.mutate({
            id: house.id,
            input: {
                isFavorite: newFavoriteStatus ? true : false,
                // If setting to favorite, unfavorite all others
                ...(newFavoriteStatus && {
                    // This will be handled by updating all houses
                }),
            },
        });

        // If setting this house as favorite, unfavorite all others
        if (newFavoriteStatus && houses) {
            houses.forEach((h) => {
                if (h.id !== house.id && h.isFavorite) {
                    updateHouseMutation.mutate({
                        id: h.id,
                        input: { isFavorite: false },
                    });
                }
            });
        }
    };

    const handleEdit = (house: House) => {
        navigation.navigate('HouseDetailScreen', { house });
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

    const renderItem = ({ item }: { item: House }) => (
        <HouseCard
            ref={(ref) => {
                if (ref) {
                    swipeableRefs.current.set(item.id, ref);
                } else {
                    swipeableRefs.current.delete(item.id);
                }
            }}
            id={item.id}
            name={item.name}
            address={item.address}
            isFavorite={item.isFavorite}
            onDelete={() => handleDelete(item.id)}
            onToggleFavorite={() => handleToggleFavorite(item)}
            onPress={() => handleEdit(item)}
            onSwipeableOpen={() => onSwipeableOpen(item.id)}
        />
    );

    if (isLoading) {
        return (
            <View style={styles.centerContainer}>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.centerContainer}>
                <Text>Error loading houses</Text>
            </View>
        );
    }

    return (
        <TouchableWithoutFeedback onPress={closeOpenSwipe}>
            <View style={styles.container}>
                <FlatList
                    data={houses || []}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={styles.listContent}
                />
                <FAB
                    icon="home-plus-outline"
                    customSize={64}
                    style={styles.fab}
                    onPress={() => navigation.navigate('HouseFormScreen', {})}
                    testID="add-house-fab"
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
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
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

export default HouseListScreen;
