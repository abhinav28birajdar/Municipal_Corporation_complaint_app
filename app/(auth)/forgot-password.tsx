import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { Link, useRouter } from 'expo-router';
import ScreenWrapper from '../../components/ui/ScreenWrapper';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import { spacing } from '../../constants/spacing';

export default function ForgotPassword() {
    const theme = useTheme();
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [sent, setSent] = useState(false);

    const handleReset = () => {
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            setSent(true);
        }, 1500);
    };

    return (
        <ScreenWrapper style={styles.container}>
            <View style={styles.header}>
                <Text variant="displaySmall" style={{ fontWeight: 'bold', color: theme.colors.primary }}>Forgot Password</Text>
                <Text variant="bodyLarge" style={{ color: theme.colors.outline, marginTop: spacing.s }}>
                    Enter your email to receive a reset code.
                </Text>
            </View>

            {sent ? (
                <View style={styles.successContainer}>
                    <Text variant="headlineSmall" style={{ fontWeight: 'bold', marginBottom: spacing.m }}>Check your email</Text>
                    <Text variant="bodyMedium" style={{ textAlign: 'center', marginBottom: spacing.l }}>
                        We have sent a password recover instruction to your email.
                    </Text>
                    <Button onPress={() => router.back()} mode="outlined">Back to Login</Button>
                </View>
            ) : (
                <View style={styles.form}>
                    <Input
                        label="Email"
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                        autoCapitalize="none"
                    />

                    <Button mode="contained" onPress={handleReset} loading={loading} style={{ marginTop: spacing.l }}>
                        Send Reset Code
                    </Button>

                    <Button mode="text" onPress={() => router.back()} style={{ marginTop: spacing.m }}>
                        Back to Login
                    </Button>
                </View>
            )}
        </ScreenWrapper>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: spacing.l,
        justifyContent: 'center',
    },
    header: {
        marginBottom: spacing.xl,
    },
    form: {
        width: '100%',
    },
    successContainer: {
        alignItems: 'center',
        padding: spacing.l,
    }
});
