import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { spacing } from '../../constants/spacing';

interface TimelineItem {
    status: string;
    date: string;
    isDone: boolean;
    isCurrent?: boolean;
}

interface TimelineProgressProps {
    steps: TimelineItem[];
}

export default function TimelineProgress({ steps }: TimelineProgressProps) {
    const theme = useTheme();

    return (
        <View style={styles.container}>
            {steps.map((step, index) => (
                <View key={index} style={styles.item}>
                    <View style={styles.markerContainer}>
                        <View style={[
                            styles.dot,
                            {
                                backgroundColor: step.isDone ? theme.colors.secondary : theme.colors.outline + '40',
                                borderWidth: step.isCurrent ? 3 : 0,
                                borderColor: theme.colors.primary
                            }
                        ]}>
                            {step.isDone && <MaterialCommunityIcons name="check" size={10} color="#FFF" />}
                        </View>
                        {index < steps.length - 1 && (
                            <View style={[
                                styles.line,
                                { backgroundColor: step.isDone && steps[index + 1].isDone ? theme.colors.secondary : theme.colors.outline + '40' }
                            ]} />
                        )}
                    </View>
                    <View style={styles.content}>
                        <Text variant="titleSmall" style={{ fontWeight: step.isCurrent ? 'bold' : 'normal', color: step.isDone ? theme.colors.onSurface : theme.colors.outline }}>
                            {step.status}
                        </Text>
                        <Text variant="labelSmall" style={{ color: theme.colors.outline }}>{step.date}</Text>
                    </View>
                </View>
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingVertical: spacing.s,
    },
    item: {
        flexDirection: 'row',
        minHeight: 60,
    },
    markerContainer: {
        alignItems: 'center',
        width: 30,
    },
    dot: {
        width: 18,
        height: 18,
        borderRadius: 9,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1,
    },
    line: {
        width: 2,
        flex: 1,
        marginVertical: 4,
    },
    content: {
        flex: 1,
        marginLeft: spacing.s,
        paddingBottom: spacing.m,
    }
});
