import React from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { Text, useTheme, List, Avatar } from 'react-native-paper';
import { useRouter } from 'expo-router';
import ScreenWrapper from '../../components/ui/ScreenWrapper';
import Button from '../../components/ui/Button';
import { spacing } from '../../constants/spacing';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function OnboardingPermissions() {
    const theme = useTheme();
    const router = useRouter();

    return (
        <ScreenWrapper style={styles.container}>
            <View style={styles.content}>
                <View style={styles.header}>
                    <Text variant="headlineSmall" style={{ fontWeight: 'bold' }}>Stay Informed</Text>
                    <Text variant="bodyLarge" style={styles.subtitle}>
                        We need following permissions to provide the best experience.
                    </Text>
                </View>

                <View style={styles.list}>
                    <List.Item
                        title="Location Access"
                        description="Auto-detect ward and complaint location."
                        left={props => <Avatar.Icon {...props} icon="map-marker-radius" style={{ backgroundColor: '#e3f2fd' }} color="#2196f3" />}
                    />
                    <List.Item
                        title="Notifications"
                        description="Get live updates on your complaints."
                        left={props => <Avatar.Icon {...props} icon="bell-ring" style={{ backgroundColor: '#e8f5e9' }} color="#4caf50" />}
                    />
                    <List.Item
                        title="Camera & Storage"
                        description="Upload photos/videos of civic issues."
                        left={props => <Avatar.Icon {...props} icon="camera" style={{ backgroundColor: '#fff3e0' }} color="#ff9800" />}
                    />
                </View>

                <View style={styles.footer}>
                    <Text variant="labelSmall" style={styles.disclaimer}>
                        You can manage these permissions anytime in system settings.
                    </Text>
                    <Button
                        mode="contained"
                        onPress={() => router.push('/onboarding/language-selection')}
                        style={styles.button}
                    >
                        Allow & Continue
                    </Button>
                </View>
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
        padding: spacing.xl,
        justifyContent: 'space-between',
    },
    header: {
        marginTop: spacing.xl,
    },
    subtitle: {
        color: '#757575',
        marginTop: spacing.s,
    },
    list: {
        marginVertical: spacing.xl,
    },
    footer: {
        alignItems: 'center',
    },
    disclaimer: {
        color: '#9E9E9E',
        textAlign: 'center',
        marginBottom: spacing.l,
    },
    button: {
        width: '100%',
        marginBottom: spacing.l,
    }
});
