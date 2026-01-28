import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Text, useTheme, TextInput, Checkbox, RadioButton, List, Portal, Modal } from 'react-native-paper';
import { useRouter } from 'expo-router';
import ScreenWrapper from '../../components/ui/ScreenWrapper';
import AppHeader from '../../components/headers/AppHeader';
import Button from '../../components/ui/Button';
import { spacing } from '../../constants/spacing';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function Register() {
    const theme = useTheme();
    const router = useRouter();

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [userType, setUserType] = useState('citizen');
    const [ward, setWard] = useState('');
    const [accepted, setAccepted] = useState(false);

    const handleRegister = () => {
        router.push('/(auth)/otp');
    };

    return (
        <ScreenWrapper>
            <AppHeader title="Create Account" showBack />

            <ScrollView contentContainerStyle={styles.content}>
                <View style={styles.header}>
                    <Text variant="displaySmall" style={{ fontWeight: 'bold', color: theme.colors.primary }}>Join Us</Text>
                    <Text variant="bodyLarge" style={{ color: theme.colors.outline }}>Connect with your Municipal Corporation</Text>
                </View>

                <View style={styles.form}>
                    <TextInput
                        label="Full Name"
                        mode="outlined"
                        value={name}
                        onChangeText={setName}
                        left={<TextInput.Icon icon="account" />}
                        style={styles.input}
                    />
                    <TextInput
                        label="Email Address"
                        mode="outlined"
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                        left={<TextInput.Icon icon="email" />}
                        style={styles.input}
                    />
                    <TextInput
                        label="Phone Number"
                        mode="outlined"
                        value={phone}
                        onChangeText={setPhone}
                        keyboardType="phone-pad"
                        left={<TextInput.Icon icon="phone" />}
                        style={styles.input}
                    />
                    <TextInput
                        label="Password"
                        mode="outlined"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                        left={<TextInput.Icon icon="lock" />}
                        style={styles.input}
                    />

                    <Text variant="titleMedium" style={styles.sectionLabel}>I am a...</Text>
                    <RadioButton.Group onValueChange={value => setUserType(value)} value={userType}>
                        <View style={styles.row}>
                            <View style={styles.radioItem}>
                                <RadioButton value="citizen" />
                                <Text>Citizen</Text>
                            </View>
                            <View style={styles.radioItem}>
                                <RadioButton value="employee" />
                                <Text>Employee</Text>
                            </View>
                            <View style={styles.radioItem}>
                                <RadioButton value="admin" />
                                <Text>Admin</Text>
                            </View>
                        </View>
                    </RadioButton.Group>

                    <Text variant="titleMedium" style={styles.sectionLabel}>Select Ward/Area</Text>
                    <TouchableOpacity style={styles.dropdown} onPress={() => { }}>
                        <Text style={{ color: ward ? theme.colors.onSurface : theme.colors.outline }}>
                            {ward || 'Select your Ward'}
                        </Text>
                        <MaterialCommunityIcons name="chevron-down" size={24} color={theme.colors.outline} />
                    </TouchableOpacity>

                    <View style={styles.termsRow}>
                        <Checkbox
                            status={accepted ? 'checked' : 'unchecked'}
                            onPress={() => setAccepted(!accepted)}
                        />
                        <Text variant="bodySmall" style={{ flex: 1, marginLeft: 8 }}>
                            I agree to the <Text style={{ color: theme.colors.primary, fontWeight: 'bold' }}>Terms & Conditions</Text> and <Text style={{ color: theme.colors.primary, fontWeight: 'bold' }}>Privacy Policy</Text>.
                        </Text>
                    </View>

                    <Button mode="contained" onPress={handleRegister} style={styles.button}>
                        Register
                    </Button>

                    <View style={styles.footer}>
                        <Text variant="bodyMedium">Already have an account? </Text>
                        <TouchableOpacity onPress={() => router.push('/(auth)/login')}>
                            <Text variant="bodyMedium" style={{ color: theme.colors.primary, fontWeight: 'bold' }}>Login</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </ScreenWrapper>
    );
}

const styles = StyleSheet.create({
    content: {
        padding: spacing.l,
    },
    header: {
        marginBottom: spacing.xl,
    },
    form: {
        width: '100%',
    },
    input: {
        marginBottom: spacing.m,
        backgroundColor: '#FFF',
    },
    sectionLabel: {
        fontWeight: 'bold',
        marginTop: spacing.s,
        marginBottom: spacing.s,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: spacing.m,
    },
    radioItem: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    dropdown: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        padding: spacing.m,
        marginBottom: spacing.m,
    },
    termsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: spacing.l,
    },
    button: {
        marginBottom: spacing.l,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 40,
    }
});
