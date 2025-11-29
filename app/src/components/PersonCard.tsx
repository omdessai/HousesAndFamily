import React, { forwardRef } from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { Card, Text, IconButton, useTheme } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import SwipeableItem, { SwipeableItemRef } from './SwipeableItem';

interface PersonCardProps {
    id: string;
    name: string;
    relation: string;
    isFavorite: boolean;
    onDelete: () => void;
    onToggleFavorite: () => void;
    onEdit: () => void;
    onSwipeableOpen?: () => void;
}

const PersonCard = forwardRef<SwipeableItemRef, PersonCardProps>(
    (
        {
            id,
            name,
            relation,
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
                <Card style={[styles.card, { backgroundColor: '#F8F9FF' }]} testID={`person-card-${id}`}>
                    <TouchableOpacity onPress={onEdit} activeOpacity={0.7}>
                        <Card.Content style={styles.content}>
                            <View style={styles.leftContent}>
                                <Icon
                                    name="account-circle"
                                    size={50}
                                    color={theme.colors.primary}
                                    style={styles.personIcon}
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
                                        testID={`person-name-${id}`}
                                    >
                                        {name}
                                    </Text>
                                    <Text
                                        variant="bodyMedium"
                                        style={[
                                            styles.relationText,
                                            { color: theme.colors.onSurfaceVariant },
                                        ]}
                                        numberOfLines={1}
                                        ellipsizeMode="tail"
                                    >
                                        {relation}
                                    </Text>
                                </View>
                            </View>
                            <View style={styles.rightActions}>
                                <IconButton
                                    icon={isFavorite ? 'heart' : 'heart-outline'}
                                    iconColor={isFavorite ? theme.colors.error : theme.colors.onSurfaceVariant}
                                    size={24}
                                    onPress={onToggleFavorite}
                                    testID={`person-favorite-button-${id}`}
                                />
                                <IconButton
                                    icon="pencil-outline"
                                    iconColor={theme.colors.onSurfaceVariant}
                                    size={24}
                                    onPress={onEdit}
                                    testID={`person-edit-button-${id}`}
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
    personIcon: {
        marginRight: 16,
    },
    textContainer: {
        flex: 1,
    },
    nameText: {
        fontWeight: 'bold',
    },
    relationText: {
        marginTop: 6,
    },
    rightActions: {
        flexDirection: 'row',
        alignItems: 'center',
    },
});

export default PersonCard;
