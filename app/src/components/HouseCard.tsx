import React, { useState } from 'react';
import { StyleSheet, View, TouchableOpacity, TextInput } from 'react-native';
import { Card, Text, IconButton } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import SwipeableItem from './SwipeableItem';

interface HouseCardProps {
    id: string;
    initialName: string;
    address: string;
    isFavorite: boolean;
    onDelete: () => void;
    onToggleFavorite: () => void;
    onUpdateName: (newName: string) => void;
}

const HouseCard: React.FC<HouseCardProps> = ({
    id,
    initialName,
    address,
    isFavorite,
    onDelete,
    onToggleFavorite,
    onUpdateName,
}) => {
    const [isEditing, setIsEditing] = useState(false);
    const [name, setName] = useState(initialName);

    const handleSaveName = () => {
        setIsEditing(false);
        onUpdateName(name);
    };

    return (
        <SwipeableItem onDelete={onDelete}>
            <Card style={styles.card}>
                <Card.Content style={styles.content}>
                    <View style={styles.leftContent}>
                        <Icon name="home" size={40} color="#6200ee" style={styles.houseIcon} />
                        <View style={styles.textContainer}>
                            {isEditing ? (
                                <TextInput
                                    style={styles.input}
                                    value={name}
                                    onChangeText={setName}
                                    onBlur={handleSaveName}
                                    onSubmitEditing={handleSaveName}
                                    autoFocus
                                />
                            ) : (
                                <TouchableOpacity onPress={() => setIsEditing(true)}>
                                    <Text variant="titleMedium" style={styles.nameText}>
                                        {name}
                                    </Text>
                                </TouchableOpacity>
                            )}
                            <Text variant="bodyMedium" style={styles.addressText}>
                                {address}
                            </Text>
                        </View>
                    </View>
                    <View style={styles.rightActions}>
                        <IconButton
                            icon={isFavorite ? 'heart' : 'heart-outline'}
                            iconColor={isFavorite ? 'red' : 'gray'}
                            size={24}
                            onPress={onToggleFavorite}
                        />
                        <IconButton
                            icon="pencil"
                            size={24}
                            onPress={() => setIsEditing(true)}
                        />
                        <IconButton
                            icon="trash-can-outline"
                            size={24}
                            onPress={onDelete}
                        />
                    </View>
                </Card.Content>
            </Card>
        </SwipeableItem>
    );
};

const styles = StyleSheet.create({
    card: {
        marginBottom: 16,
        backgroundColor: 'white',
        elevation: 2,
    },
    content: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
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
        borderBottomColor: '#6200ee',
        padding: 0,
        margin: 0,
    },
    addressText: {
        color: 'gray',
    },
    rightActions: {
        flexDirection: 'row',
        alignItems: 'center',
    },
});

export default HouseCard;
