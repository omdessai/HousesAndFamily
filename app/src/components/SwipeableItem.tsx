import React, { forwardRef, useImperativeHandle, useRef } from 'react';
import { StyleSheet, View, Animated, TouchableOpacity } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Text } from 'react-native-paper';

export interface SwipeableItemRef {
    close: () => void;
}

interface SwipeableItemProps {
    children: React.ReactNode;
    onDelete: () => void;
    onSwipeableOpen?: () => void;
}

const SwipeableItem = forwardRef<SwipeableItemRef, SwipeableItemProps>(
    ({ children, onDelete, onSwipeableOpen }, ref) => {
        const swipeableRef = useRef<Swipeable>(null);

        useImperativeHandle(ref, () => ({
            close: () => {
                swipeableRef.current?.close();
            },
        }));

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
            <Swipeable
                ref={swipeableRef}
                renderRightActions={renderRightActions}
                onSwipeableOpen={onSwipeableOpen}
            >
                <View style={styles.container}>{children}</View>
            </Swipeable>
        );
    }
);

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
        borderRadius: 12,
        marginBottom: 16,
    },
    deleteText: {
        color: '#fff',
        fontWeight: '600',
        padding: 10,
    },
});

export default SwipeableItem;
