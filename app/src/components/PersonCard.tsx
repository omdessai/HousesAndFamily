import React, { forwardRef } from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { Card, Text, Avatar, useTheme } from 'react-native-paper';
import SwipeableItem, { SwipeableItemRef } from './SwipeableItem';

interface PersonCardProps {
    id: string;
    name: string;
    birthDate?: Date | null;
    avatarUri?: string | null;
    onDelete: () => void;
    onPress: () => void;
    onSwipeableOpen?: () => void;
}

const PersonCard = forwardRef<SwipeableItemRef, PersonCardProps>(
    (
        {
            id,
            name,
            birthDate,
            avatarUri,
            onDelete,
            onPress,
            onSwipeableOpen,
        },
        ref
    ) => {
        const theme = useTheme();

        const formattedDate = birthDate
            ? new Date(birthDate).toLocaleDateString()
            : null;

        return (
            <SwipeableItem
                ref={ref}
                onDelete={onDelete}
                onSwipeableOpen={onSwipeableOpen}
            >
                <Card style={[styles.card, { backgroundColor: '#F8F9FF' }]} testID={`person-card-${id}`}>
                    <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
                        <Card.Content style={styles.content}>
                            <View style={styles.leftContent}>
                                {avatarUri ? (
                                    avatarUri.startsWith('icon:') ? (
                                        <View style={[styles.iconAvatar, { backgroundColor: theme.colors.primary }]}>
                                            <Text style={[styles.iconAvatarText, { color: theme.colors.onPrimary }]}>{avatarUri.replace('icon:', '')}</Text>
                                        </View>
                                    ) : (
                                        <Avatar.Image
                                            size={50}
                                            source={{ uri: avatarUri }}
                                            style={styles.personIcon}
                                        />
                                    )
                                ) : (
                                    <Avatar.Icon
                                        size={50}
                                        icon="account"
                                        color={theme.colors.onPrimary}
                                        style={{ backgroundColor: theme.colors.primary, marginRight: 16 }}
                                    />
                                )}
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
                                    {formattedDate && (
                                        <Text
                                            variant="bodyMedium"
                                            style={[
                                                styles.dateText,
                                                { color: theme.colors.onSurfaceVariant },
                                            ]}
                                        >
                                            Born: {formattedDate}
                                        </Text>
                                    )}
                                </View>
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
        paddingVertical: 16,
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
        justifyContent: 'center',
    },
    nameText: {
        fontWeight: 'bold',
    },
    dateText: {
        marginTop: 4,
    },
    iconAvatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#E3F2FD',
        justifyContent: 'center',
        alignItems: 'center',
    },
    iconAvatarText: {
        fontSize: 30,
    },
});

export default PersonCard;
