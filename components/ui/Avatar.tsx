import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text, useTheme, Avatar as PaperAvatar } from 'react-native-paper';

interface AvatarProps {
    source?: string;
    label?: string;
    size?: number;
    style?: any;
    onPress?: () => void;
}

export default function Avatar({ source, label, size = 48, style, onPress }: AvatarProps) {
    const theme = useTheme();

    const content = source ? (
        <PaperAvatar.Image size={size} source={{ uri: source }} style={style} />
    ) : (
        <PaperAvatar.Text size={size} label={label || '?'} style={[{ backgroundColor: theme.colors.primaryContainer }, style]} labelStyle={{ color: theme.colors.onPrimaryContainer }} />
    );

    if (onPress) {
        return (
            <View onStartShouldSetResponder={() => true} onResponderRelease={onPress}>
                {content}
            </View>
        );
    }

    return content;
}
