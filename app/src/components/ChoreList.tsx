import React from 'react';
import { StyleSheet, FlatList, View, Alert } from 'react-native';
import { Card, Text, IconButton, FAB, Chip, useTheme } from 'react-native-paper';
import type { Chore } from '../types/chore';

interface ChoreListProps {
    data: Chore[];
    onAddChore: () => void;
}

const ChoreList = ({ data, onAddChore }: ChoreListProps) => {
    const theme = useTheme();

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'High': return theme.colors.error;
            case 'Medium': return theme.colors.warning;
            case 'Low': return theme.colors.primary;
            default: return theme.colors.primary;
        }
    };

    const renderItem = ({ item }: { item: Chore }) => (
        <Card style={styles.card} onPress={() => Alert.alert('Chore Details', `Details for ${item.title}`)}>
            <Card.Title
                title={item.title}
                subtitle={`Due: ${item.dueDate} • ${item.frequency}`}
                left={(props) => <IconButton {...props} icon="checkbox-marked-circle-outline" />}
                right={(props) => (
                    <View style={styles.rightContainer}>
                        <Chip
                            textStyle={{ fontSize: 10, lineHeight: 10 }}
                            style={[styles.priorityChip, { backgroundColor: theme.colors.surfaceVariant }]}
                        >
                            {item.priority}
                        </Chip>
                    </View>
                )}
            />
        </Card>
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
                icon="plus"
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
