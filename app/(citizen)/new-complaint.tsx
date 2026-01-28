import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Text, useTheme, TextInput, List, Divider, Checkbox, HelperText } from 'react-native-paper';
import { useRouter } from 'expo-router';
import ScreenWrapper from '../../components/ui/ScreenWrapper';
import AppHeader from '../../components/headers/AppHeader';
import Button from '../../components/ui/Button';
import { spacing } from '../../constants/spacing';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function NewComplaint() {
    const theme = useTheme();
    const router = useRouter();

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('');
    const [isAnonymous, setIsAnonymous] = useState(false);
    const [location, setLocation] = useState('Auto-detected: Ward 12, Main St.');

    const handleSumbit = () => {
        router.push('/(citizen)/complaint-success');
    };

    return (
        <ScreenWrapper>
            <AppHeader title="New Complaint" showBack />

            <ScrollView contentContainerStyle={styles.content}>
                <View style={styles.section}>
                    <Text variant="titleMedium" style={styles.label}>Complaint Category</Text>
                    <TouchableOpacity style={styles.dropdown} onPress={() => { }}>
                        <Text style={{ color: category ? theme.colors.onSurface : theme.colors.outline }}>
                            {category || 'Select Category'}
                        </Text>
                        <MaterialCommunityIcons name="chevron-down" size={24} color={theme.colors.outline} />
                    </TouchableOpacity>
                </View>

                <View style={styles.section}>
                    <Text variant="titleMedium" style={styles.label}>Complaint Title</Text>
                    <TextInput
                        mode="outlined"
                        placeholder="E.g. Road Pothole near Central Park"
                        value={title}
                        onChangeText={setTitle}
                        style={styles.input}
                    />
                </View>

                <View style={styles.section}>
                    <Text variant="titleMedium" style={styles.label}>Description</Text>
                    <TextInput
                        mode="outlined"
                        multiline
                        numberOfLines={4}
                        placeholder="Provide details about the issue..."
                        value={description}
                        onChangeText={setDescription}
                        style={styles.input}
                    />
                </View>

                <View style={styles.section}>
                    <Text variant="titleMedium" style={styles.label}>Location</Text>
                    <View style={styles.locationContainer}>
                        <MaterialCommunityIcons name="map-marker-radius" size={24} color={theme.colors.primary} />
                        <Text style={styles.locationText}>{location}</Text>
                        <TouchableOpacity>
                            <Text style={{ color: theme.colors.primary, fontWeight: '600' }}>Change</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={styles.section}>
                    <Text variant="titleMedium" style={styles.label}>Attachments (Photos/Video)</Text>
                    <View style={styles.uploadContainer}>
                        <TouchableOpacity style={styles.uploadButton}>
                            <MaterialCommunityIcons name="camera-plus" size={32} color={theme.colors.primary} />
                            <Text variant="labelSmall" style={{ marginTop: 4 }}>Capture</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.uploadButton}>
                            <MaterialCommunityIcons name="image-plus" size={32} color={theme.colors.outline} />
                            <Text variant="labelSmall" style={{ marginTop: 4 }}>Gallery</Text>
                        </TouchableOpacity>
                    </View>
                    <HelperText type="info">Upload up to 5 files (Max 10MB each)</HelperText>
                </View>

                <View style={styles.anonymousContainer}>
                    <Checkbox.Item
                        label="Report Anonymously"
                        status={isAnonymous ? 'checked' : 'unchecked'}
                        onPress={() => setIsAnonymous(!isAnonymous)}
                        mode="android"
                        position="leading"
                        labelStyle={{ textAlign: 'left', marginLeft: 8 }}
                    />
                </View>

                <Button mode="contained" onPress={handleSumbit} style={styles.submitButton}>
                    Submit Complaint
                </Button>

                <Button mode="text" onPress={() => router.back()} style={{ marginBottom: 40 }}>
                    Cancel
                </Button>

            </ScrollView>
        </ScreenWrapper>
    );
}

const styles = StyleSheet.create({
    content: {
        padding: spacing.m,
    },
    section: {
        marginBottom: spacing.l,
    },
    label: {
        fontWeight: 'bold',
        marginBottom: spacing.s,
    },
    dropdown: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        padding: spacing.m,
    },
    input: {
        backgroundColor: '#FFF',
    },
    locationContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: spacing.m,
        backgroundColor: '#f5f5f5',
        borderRadius: 12,
    },
    locationText: {
        flex: 1,
        marginHorizontal: spacing.s,
        color: '#424242',
    },
    uploadContainer: {
        flexDirection: 'row',
        marginTop: spacing.s,
    },
    uploadButton: {
        width: 80,
        height: 80,
        borderWidth: 1,
        borderStyle: 'dashed',
        borderColor: '#ccc',
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: spacing.m,
    },
    anonymousContainer: {
        marginVertical: spacing.s,
    },
    submitButton: {
        marginTop: spacing.l,
        marginBottom: spacing.s,
    }
});
