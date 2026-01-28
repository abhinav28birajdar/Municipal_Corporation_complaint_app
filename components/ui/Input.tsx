import React from 'react';
import { StyleSheet, View, ViewStyle, KeyboardTypeOptions } from 'react-native';
import { TextInput, HelperText, useTheme } from 'react-native-paper';
import { spacing } from '../../constants/spacing';

interface InputProps {
    label: string;
    value: string;
    onChangeText: (text: string) => void;
    error?: string;
    secureTextEntry?: boolean;
    keyboardType?: KeyboardTypeOptions;
    style?: ViewStyle;
    disabled?: boolean;
    placeholder?: string;
    multiline?: boolean;
    numberOfLines?: number;
    left?: React.ReactNode;
    right?: React.ReactNode;
    autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
}

export default function Input({
    label,
    value,
    onChangeText,
    error,
    secureTextEntry = false,
    keyboardType = 'default',
    style,
    disabled = false,
    placeholder,
    multiline = false,
    numberOfLines = 1,
    left,
    right,
    autoCapitalize = 'none'
}: InputProps) {
    const theme = useTheme();

    return (
        <View style={[styles.container, style]}>
            <TextInput
                mode="outlined"
                label={label}
                value={value}
                onChangeText={onChangeText}
                secureTextEntry={secureTextEntry}
                keyboardType={keyboardType}
                disabled={disabled}
                placeholder={placeholder}
                multiline={multiline}
                numberOfLines={numberOfLines}
                error={!!error}
                style={[styles.input, { backgroundColor: theme.colors.surface }]}
                outlineStyle={{ borderRadius: 12 }}
                left={left}
                right={right}
                autoCapitalize={autoCapitalize}
                textColor={theme.colors.onSurface}
            />
            {error ? (
                <HelperText type="error" visible={!!error}>
                    {error}
                </HelperText>
            ) : null}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginBottom: spacing.s,
    },
    input: {
        fontSize: 16,
        fontFamily: 'Inter_400Regular',
    },
});
