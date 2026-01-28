import React, { useState, useRef, useEffect } from 'react';
import { View, StyleSheet, TextInput as RNTextInput, TouchableOpacity } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { useRouter } from 'expo-router';
import ScreenWrapper from '../../components/ui/ScreenWrapper';
import AppHeader from '../../components/headers/AppHeader';
import Button from '../../components/ui/Button';
import { spacing } from '../../constants/spacing';

export default function OTP_Verification() {
    const theme = useTheme();
    const router = useRouter();
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [timer, setTimer] = useState(30);
    const inputs = useRef<Array<RNTextInput | null>>([]);

    useEffect(() => {
        const interval = setInterval(() => {
            if (timer > 0) setTimer(timer - 1);
        }, 1000);
        return () => clearInterval(interval);
    }, [timer]);

    const handleChange = (text: string, index: number) => {
        const newOtp = [...otp];
        newOtp[index] = text;
        setOtp(newOtp);

        if (text && index < 5) {
            inputs.current[index + 1]?.focus();
        }
    };

    const handleKeyPress = (e: any, index: number) => {
        if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
            inputs.current[index - 1]?.focus();
        }
    };

    const handleVerify = () => {
        router.replace('/(citizen)/home');
    };

    return (
        <ScreenWrapper>
            <AppHeader title="Verification" showBack />

            <View style={styles.container}>
                <View style={styles.header}>
                    <Text variant="headlineSmall" style={{ fontWeight: 'bold' }}>Enter 6-Digit OTP</Text>
                    <Text variant="bodyMedium" style={{ color: theme.colors.outline, textAlign: 'center', marginTop: 8 }}>
                        We have sent a verification code to +91 98765 43210
                    </Text>
                </View>

                <View style={styles.otpRow}>
                    {otp.map((digit, index) => (
                        <RNTextInput
                            key={index}
                            ref={ref => { inputs.current[index] = ref; }}
                            style={[styles.otpInput, { borderColor: digit ? theme.colors.primary : '#E0E0E0' }]}
                            maxLength={1}
                            keyboardType="number-pad"
                            value={digit}
                            onChangeText={text => handleChange(text, index)}
                            onKeyPress={e => handleKeyPress(e, index)}
                        />
                    ))}
                </View>

                <TouchableOpacity
                    disabled={timer > 0}
                    style={styles.resendBtn}
                    onPress={() => setTimer(30)}
                >
                    <Text style={{ color: timer > 0 ? theme.colors.outline : theme.colors.primary, fontWeight: 'bold' }}>
                        {timer > 0 ? `Resend OTP in ${timer}s` : 'Resend OTP'}
                    </Text>
                </TouchableOpacity>

                <Button mode="contained" onPress={handleVerify} style={styles.button}>
                    Verify & Continue
                </Button>
            </View>
        </ScreenWrapper>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: spacing.l,
        alignItems: 'center',
    },
    header: {
        alignItems: 'center',
        marginVertical: spacing.xl,
    },
    otpRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        marginBottom: spacing.xl,
    },
    otpInput: {
        width: 45,
        height: 55,
        borderWidth: 1.5,
        borderRadius: 12,
        textAlign: 'center',
        fontSize: 24,
        fontWeight: 'bold',
        backgroundColor: '#FFF',
    },
    resendBtn: {
        marginBottom: spacing.xl,
    },
    button: {
        width: '100%',
    }
});
