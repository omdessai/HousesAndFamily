import React, { forwardRef } from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { Card, Text, IconButton, useTheme } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import SwipeableItem, { SwipeableItemRef } from './SwipeableItem';

interface HouseCardProps {
    id: string;
    name: string;
    address: string;
    isFavorite: boolean;
    onDelete: () => void;
    onToggleFavorite: () => void;
    onEdit: () => void;
    onSwipeableOpen?: () => void;
}

const HouseCard = forwardRef<SwipeableItemRef, HouseCardProps>(
    (
        {
            id,
            name,
            address,
            isFavorite,
            onDelete,
            onToggleFavorite,
            onEdit,
            onSwipeableOpen,
        },
        ref
    ) => {
        const theme = useTheme();

        return (
            <SwipeableItem
                ref={ref}
                onDelete={onDelete}
                onSwipeableOpen={onSwipeableOpen}
            >
                <Card style={[styles.card, { backgroundColor: '#F8F9FF' }]} testID={`house-card-${id}`}>
                    <TouchableOpacity onPress={onEdit} activeOpacity={0.7}>
                        <Card.Content style={styles.content}>
                            <View style={styles.leftContent}>
                                <Icon
                                    name="home-circle"
                                    size={50}
                                    color={theme.colors.primary}
                                    style={styles.houseIcon}
                                />
                                <View style={styles.textContainer}>
                                    <Text
                                        variant="titleMedium"
                                        style={[
                                            styles.nameText,
                                            { color: theme.colors.onSurface },
                                        ]}
                                        numberOfLines={1}
                                        ellipsizeMode="tail"
                                        testID={`house-name-${id}`}
                                    >
                                        {name}
                                    </Text>
                                    <Text
                                        variant="bodyMedium"
                                        style={[
                                            styles.addressText,
                                            { color: theme.colors.onSurfaceVariant },
                                        ]}
                                        numberOfLines={2}
                                        ellipsizeMode="tail"
                                    >
                                        {address}
                                    </Text>
                                </View>
                            </View>
                            <View style={styles.rightActions}>
                                <IconButton
                                    icon={isFavorite ? 'heart' : 'heart-outline'}
                                    iconColor={isFavorite ? theme.colors.error : theme.colors.onSurfaceVariant}
                                    size={24}
                                    onPress={onToggleFavorite}
                                    testID={`favorite-button-${id}`}
                                />
                                <IconButton
                                    icon="home-edit-outline"
                                    iconColor={theme.colors.onSurfaceVariant}
                                    size={24}
                                    onPress={onEdit}
                                    testID={`edit-button-${id}`}
                                />
                            </View>
                        </Card.Content>
                    </TouchableOpacity>
                </Card>
            </SwipeableItem>
        );
    }
);

const styles = StyleSheet.create({
    card: {
        marginBottom: 16,
        elevation: 4,
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.23,
        shadowRadius: 2.62,
    },
    content: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 20,
    },
    leftContent: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    houseIcon: {
        marginRight: 16,
    },
    textContainer: {
        flex: 1,
    },
    nameText: {
        fontWeight: 'bold',
    },
    addressText: {
        marginTop: 6,
    },
    rightActions: {
        flexDirection: 'row',
        alignItems: 'center',
    },
});

export default HouseCard;
