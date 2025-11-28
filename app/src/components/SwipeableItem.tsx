import React from 'react';
import { StyleSheet, View, Animated, TouchableOpacity } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Text } from 'react-native-paper';

interface SwipeableItemProps {
    children: React.ReactNode;
    onDelete: () => void;
}

const SwipeableItem: React.FC<SwipeableItemProps> = ({ children, onDelete }) => {
    const renderRightActions = (
        progress: Animated.AnimatedInterpolation<number>,
        dragX: Animated.AnimatedInterpolation<number>
    ) => {
        const scale = dragX.interpolate({
            inputRange: [-100, 0],
            outputRange: [1, 0],
            extrapolate: 'clamp',
        });

        return (
            <TouchableOpacity onPress={onDelete} style={styles.deleteButton}>
                <Animated.View style={{ transform: [{ scale }] }}>
                    <Icon name="trash-can-outline" size={30} color="#fff" />
                    <Text style={styles.deleteText}>Delete</Text>
                </Animated.View>
            </TouchableOpacity>
        );
    };

    return (
        <Swipeable renderRightActions={renderRightActions}>
            <View style={styles.container}>{children}</View>
        </Swipeable>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
    },
    deleteButton: {
        backgroundColor: 'red',
        justifyContent: 'center',
        alignItems: 'center',
        width: 100,
        height: '100%',
    },
    deleteText: {
        color: '#fff',
        fontWeight: '600',
        padding: 10,
    },
});

export default SwipeableItem;
