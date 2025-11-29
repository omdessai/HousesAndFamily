import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Card, IconButton, Chip, useTheme } from 'react-native-paper';
import type { Chore } from '../types/chore';

interface ChoreCardProps {
    item: Chore;
    onPress: () => void;
}

const ChoreCard = ({ item, onPress }: ChoreCardProps) => {
    const theme = useTheme();

    return (
        <Card style={styles.card} onPress={onPress}>
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
};

const styles = StyleSheet.create({
    card: {
        marginBottom: 12,
        backgroundColor: 'white',
    },
    rightContainer: {
        paddingRight: 16,
        justifyContent: 'center',
    },
    priorityChip: {
        height: 24,
    },
});

export default ChoreCard;
