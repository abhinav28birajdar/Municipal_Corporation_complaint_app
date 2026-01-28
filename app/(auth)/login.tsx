import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Text, useTheme, TextInput, HelperText } from 'react-native-paper';
import { useRouter } from 'expo-router';
import ScreenWrapper from '../../components/ui/ScreenWrapper';
import Button from '../../components/ui/Button';
import { spacing } from '../../constants/spacing';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function Login() {
    const theme = useTheme();
    const router = useRouter();

    const [email, setEmail] = useState('citizen@mnc.com');
    const [password, setPassword] = useState('password');
    const [showPass, setShowPass] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleLogin = () => {
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            if (email.includes('admin')) {
                router.replace('/(admin)/home');
            } else if (email.includes('employee')) {
                router.replace('/(employee)/home');
            } else {
                router.replace('/(citizen)/home');
            }
        }, 1500);
    };

    return (
        <ScreenWrapper>
            <View style={styles.container}>
                <View style={styles.header}>
                    <View style={[styles.logoContainer, { backgroundColor: theme.colors.primary }]}>
                        <MaterialCommunityIcons name="office-building" size={40} color="#FFF" />
                    </View>
                    <Text variant="displaySmall" style={styles.title}>Welcome Back</Text>
                    <Text variant="bodyLarge" style={styles.subtitle}>Sign in to access your dashboard</Text>
                </View>

                <View style={styles.form}>
                    <TextInput
                        label="Email or Phone"
                        mode="outlined"
                        value={email}
                        onChangeText={setEmail}
                        left={<TextInput.Icon icon="account" />}
                        style={styles.input}
                    />
                    <TextInput
                        label="Password"
                        mode="outlined"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry={!showPass}
                        left={<TextInput.Icon icon="lock" />}
                        right={<TextInput.Icon icon={showPass ? "eye-off" : "eye"} onPress={() => setShowPass(!showPass)} />}
                        style={styles.input}
                    />

                    <TouchableOpacity style={styles.forgotPass} onPress={() => router.push('/(auth)/forgot-password')}>
                        <Text variant="bodyMedium" style={{ color: theme.colors.primary, fontWeight: 'bold' }}>Forgot Password?</Text>
                    </TouchableOpacity>

                    <Button mode="contained" onPress={handleLogin} loading={loading} style={styles.button}>
                        Login
                    </Button>

                    <View style={styles.dividerContainer}>
                        <View style={styles.divider} />
                        <Text style={styles.dividerText}>OR</Text>
                        <View style={styles.divider} />
                    </View>

                    <View style={styles.socialRow}>
                        <TouchableOpacity style={styles.socialBtn}>
                            <MaterialCommunityIcons name="google" size={24} color="#DB4437" />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.socialBtn}>
                            <MaterialCommunityIcons name="facebook" size={24} color="#4267B2" />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.footer}>
                        <Text variant="bodyMedium">Don't have an account? </Text>
                        <TouchableOpacity onPress={() => router.push('/(auth)/register')}>
                            <Text variant="bodyMedium" style={{ color: theme.colors.primary, fontWeight: 'bold' }}>Register</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={styles.demoHints}>
                    <Text variant="labelSmall" style={{ color: theme.colors.outline }}>Demo Credentials:</Text>
                    <Text variant="labelSmall" style={{ color: theme.colors.outline }}>citizen@mnc.com / admin@mnc.com / employee@mnc.com</Text>
                </View>
            </View>
        </ScreenWrapper>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: spacing.l,
        justifyContent: 'center',
    },
    header: {
        alignItems: 'center',
        marginBottom: spacing.xl,
    },
    logoContainer: {
        width: 80,
        height: 80,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: spacing.m,
        elevation: 4,
    },
    title: {
        fontWeight: 'bold',
    },
    subtitle: {
        color: '#757575',
        marginTop: spacing.xs,
    },
    form: {
        width: '100%',
    },
    input: {
        marginBottom: spacing.m,
        backgroundColor: '#FFF',
    },
    forgotPass: {
        alignSelf: 'flex-end',
        marginBottom: spacing.l,
    },
    button: {
        marginBottom: spacing.l,
    },
    dividerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: spacing.l,
    },
    divider: {
        flex: 1,
        height: 1,
        backgroundColor: '#E0E0E0',
    },
    dividerText: {
        marginHorizontal: spacing.m,
        color: '#9E9E9E',
        fontSize: 12,
    },
    socialRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: spacing.xl,
    },
    socialBtn: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#F5F5F5',
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: spacing.m,
        borderWidth: 1,
        borderColor: '#E0E0E0',
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
    },
    demoHints: {
        position: 'absolute',
        bottom: 20,
        left: 0,
        right: 0,
        alignItems: 'center',
    }
});
