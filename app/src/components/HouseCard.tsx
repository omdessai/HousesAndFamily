import React, { useState, forwardRef } from 'react';
import { StyleSheet, View, TouchableOpacity, TextInput } from 'react-native';
import { Card, Text, IconButton, useTheme } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import SwipeableItem, { SwipeableItemRef } from './SwipeableItem';

interface HouseCardProps {
    id: string;
    initialName: string;
    address: string;
    isFavorite: boolean;
    onDelete: () => void;
    onToggleFavorite: () => void;
    onUpdateName: (newName: string) => void;
    onSwipeableOpen?: () => void;
}

const HouseCard = forwardRef<SwipeableItemRef, HouseCardProps>(
    (
        {
            id,
            initialName,
            address,
            isFavorite,
            onDelete,
            onToggleFavorite,
            onUpdateName,
            onSwipeableOpen,
        },
        ref
    ) => {
        const theme = useTheme();
        const [isEditing, setIsEditing] = useState(false);
        const [name, setName] = useState(initialName);

        const handleSaveName = () => {
            setIsEditing(false);
            onUpdateName(name);
        };

        return (
            <SwipeableItem
                ref={ref}
                onDelete={onDelete}
                onSwipeableOpen={onSwipeableOpen}
            >
                <Card style={[styles.card, { backgroundColor: '#F8F9FF' }]} testID={`house-card-${id}`}>
                    <Card.Content style={styles.content}>
                        <View style={styles.leftContent}>
                            <Icon
                                name="home-circle"
                                size={50}
                                color={theme.colors.primary}
                                style={styles.houseIcon}
                            />
                            <View style={styles.textContainer}>
                                {isEditing ? (
                                    <TextInput
                                        style={[
                                            styles.input,
                                            {
                                                borderBottomColor: theme.colors.primary,
                                                color: theme.colors.onSurface,
                                            },
                                        ]}
                                        value={name}
                                        onChangeText={setName}
                                        onBlur={handleSaveName}
                                        onSubmitEditing={handleSaveName}
                                        autoFocus
                                    />
                                ) : (
                                    <TouchableOpacity onPress={() => setIsEditing(true)}>
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
                                    </TouchableOpacity>
                                )}
                                <Text
                                    variant="bodyMedium"
                                    style={[
                                        styles.addressText,
                                        { color: theme.colors.onSurfaceVariant },
                                    ]}
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
                                onPress={() => setIsEditing(true)}
                                testID={`edit-button-${id}`}
                            />
                        </View>
                    </Card.Content>
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
    input: {
        fontSize: 16,
        fontWeight: 'bold',
        borderBottomWidth: 1,
        padding: 0,
        margin: 0,
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
