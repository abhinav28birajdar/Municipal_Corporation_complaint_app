import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Dimensions, Animated } from 'react-native';
import { Text, useTheme, Avatar, FAB } from 'react-native-paper';
import { useRouter } from 'expo-router';
import ScreenWrapper from '../../components/ui/ScreenWrapper';
import AppHeader from '../../components/headers/AppHeader';
import { spacing } from '../../constants/spacing';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function VoiceComplaint() {
    const theme = useTheme();
    const router = useRouter();
    const [isRecording, setIsRecording] = useState(false);
    const [timer, setTimer] = useState(0);
    const [pulseAnim] = useState(new Animated.Value(1));

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isRecording) {
            interval = setInterval(() => {
                setTimer(prev => prev + 1);
            }, 1000);

            Animated.loop(
                Animated.sequence([
                    Animated.timing(pulseAnim, { toValue: 1.5, duration: 800, useNativeDriver: true }),
                    Animated.timing(pulseAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
                ])
            ).start();
        } else {
            setTimer(0);
            pulseAnim.setValue(1);
        }
        return () => clearInterval(interval);
    }, [isRecording]);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <ScreenWrapper style={styles.container}>
            <AppHeader title="Voice Complaint" showBack />

            <View style={styles.content}>
                <View style={styles.header}>
                    <Text variant="headlineSmall" style={{ fontWeight: 'bold' }}>Speak your Issue</Text>
                    <Text variant="bodyMedium" style={{ color: theme.colors.outline, textAlign: 'center', marginTop: 8 }}>
                        Our AI will automatically detect the category and fill in the details for you.
                    </Text>
                </View>

                <View style={styles.recordingArea}>
                    <Animated.View style={[styles.pulseCircle, { transform: [{ scale: pulseAnim }], opacity: isRecording ? 0.3 : 0, backgroundColor: theme.colors.primary }]} />
                    <TouchableOpacity
                        style={[styles.recordButton, { backgroundColor: isRecording ? theme.colors.error : theme.colors.primary }]}
                        onPress={() => setIsRecording(!isRecording)}
                    >
                        <MaterialCommunityIcons name={isRecording ? "stop" : "microphone"} size={48} color="#FFF" />
                    </TouchableOpacity>
                    <Text variant="headlineMedium" style={[styles.timer, { color: isRecording ? theme.colors.error : theme.colors.onSurface }]}>
                        {formatTime(timer)}
                    </Text>
                    {isRecording && <Text variant="bodyMedium" style={{ color: theme.colors.error }}>Recording... Tap to stop</Text>}
                </View>

                {!isRecording && timer === 0 && (
                    <View style={styles.hintBox}>
                        <Text variant="labelLarge" style={{ fontWeight: 'bold' }}>Try saying:</Text>
                        <Text variant="bodyMedium" style={styles.hintText}>"There is a water leakage near the primary school on Station Road."</Text>
                    </View>
                )}

                {timer > 0 && !isRecording && (
                    <View style={styles.actionRow}>
                        <TouchableOpacity style={styles.actionBtn}>
                            <MaterialCommunityIcons name="delete" size={24} color={theme.colors.error} />
                            <Text style={{ color: theme.colors.error }}>Delete</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.actionBtn, styles.primaryAction]} onPress={() => router.push('/(citizen)/new-complaint')}>
                            <Text style={{ color: '#FFF', fontWeight: 'bold' }}>Continue to Preview</Text>
                            <MaterialCommunityIcons name="arrow-right" size={20} color="#FFF" />
                        </TouchableOpacity>
                    </View>
                )}
            </View>
        </ScreenWrapper>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#FFF',
    },
    content: {
        flex: 1,
        padding: spacing.l,
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: spacing.xl,
    },
    header: {
        alignItems: 'center',
    },
    recordingArea: {
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
    },
    pulseCircle: {
        width: 120,
        height: 120,
        borderRadius: 60,
        position: 'absolute',
    },
    recordButton: {
        width: 100,
        height: 100,
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 5,
        zIndex: 2,
    },
    timer: {
        marginTop: spacing.xl,
        fontWeight: 'bold',
        fontVariant: ['tabular-nums'],
    },
    hintBox: {
        backgroundColor: '#f8f9fa',
        padding: spacing.l,
        borderRadius: 16,
        width: '100%',
    },
    hintText: {
        fontStyle: 'italic',
        marginTop: 8,
        color: '#616161',
    },
    actionRow: {
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    actionBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: spacing.m,
    },
    primaryAction: {
        backgroundColor: '#2196f3',
        borderRadius: 12,
        paddingHorizontal: 20,
    }
});
