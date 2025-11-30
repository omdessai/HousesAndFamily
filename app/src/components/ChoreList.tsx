import React from 'react';
import { StyleSheet, FlatList, View } from 'react-native';
import { FAB, Text, useTheme } from 'react-native-paper';
import type { Chore } from '../types/chore';
import ChoreCard from './ChoreCard';

interface ChoreListProps {
    data: Chore[];
    onAddChore: () => void;
    onChorePress: (chore: Chore) => void;
}

const ChoreList = ({ data, onAddChore, onChorePress }: ChoreListProps) => {
    const theme = useTheme();

    const renderItem = ({ item }: { item: Chore }) => (
        <ChoreCard item={item} onPress={() => onChorePress(item)} />
    );

    return (
        <View style={styles.container}>
            <FlatList
                data={data}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.listContent}
                ListEmptyComponent={
                    <View style={styles.emptyState}>
                        <Text variant="bodyLarge" style={styles.emptyText}>No chores yet. Add one!</Text>
                    </View>
                }
            />
            <FAB
                icon="clipboard-plus-outline"
                label="Add Chore"
                style={styles.fab}
                onPress={onAddChore}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    listContent: {
        padding: 16,
        paddingBottom: 80, // Space for FAB
    },
    card: {
        marginBottom: 12,
        backgroundColor: 'white',
    },
    fab: {
        position: 'absolute',
        margin: 16,
        right: 0,
        bottom: 0,
    },
    emptyState: {
        padding: 40,
        alignItems: 'center',
    },
    emptyText: {
        color: 'gray',
    },
    rightContainer: {
        paddingRight: 16,
        justifyContent: 'center',
    },
    priorityChip: {
        height: 24,
    },
});

export default ChoreList;
