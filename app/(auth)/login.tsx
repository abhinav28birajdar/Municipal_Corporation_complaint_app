import React, { useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from "react-native";
import { AuthForm, AuthFormData } from "@/components/auth/AuthForm";
import { colors } from "@/constants/Colors";
import { useRouter } from "expo-router";
import { useAuthStore } from "@/store/auth-store";
import { StatusBar } from "expo-status-bar";
import { Button } from "@/components/ui/Button";
import { Ionicons } from '@expo/vector-icons';

export default function LoginScreen() {
  const router = useRouter();
  const {
    login,
    isAuthenticated,
    isLoading,
    error,
    clearError,
    signInWithGoogle,
    signInWithFacebook
  } = useAuthStore();

  useEffect(() => {
    if (isAuthenticated) {
      router.replace("/(tabs)");
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    if (error && !isLoading) {
      Alert.alert("Login Error", error);
      clearError();
    }
  }, [error, isLoading, clearError]);

  const handleLogin = async (data: AuthFormData) => {
    clearError();
    await login(data.email, data.password);
  };

  const handleRegister = () => {
    clearError();
    router.push("/register");
  };

  const handleForgotPassword = () => {
    Alert.alert("Forgot Password", "Forgot password functionality not implemented yet.");
  };

  const iconColor = StyleSheet.flatten(styles.socialButtonText)?.color || colors.text;
  const iconSize = 20;

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
    >
      <StatusBar style="dark" />
      <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
       >
        <View style={styles.header}>
          <Image
            source={{ uri: "https://images.unsplash.com/photo-1605000797499-95a51c5269ae?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1374&q=80" }}
            style={styles.logo}
            resizeMode="cover"
          />
          <Text style={styles.title}>Welcome Back</Text>
          <Text style={styles.subtitle}>
            Login to access your account and manage your complaints
          </Text>
        </View>

        <View style={styles.formContainer}>
          <AuthForm
            type="login"
            onSubmit={handleLogin}
            isLoading={isLoading}
            error={null}
          />

          <TouchableOpacity
            onPress={handleForgotPassword}
            style={styles.forgotPasswordContainer}
            disabled={isLoading}
          >
            <Text style={[styles.forgotPasswordText, isLoading && styles.disabledText]}>
              Forgot password?
            </Text>
          </TouchableOpacity>

           <View style={styles.separatorContainer}>
             <View style={styles.separatorLine} />
             <Text style={styles.separatorText}>OR</Text>
             <View style={styles.separatorLine} />
           </View>

          <View style={styles.socialButtons}>
            <Button
              title="Continue with Google"
              onPress={signInWithGoogle}
              style={styles.socialButton}
              textStyle={styles.socialButtonText}
              leftIcon={<Ionicons name="logo-google" size={iconSize} color={iconColor} />}
              disabled={isLoading}
            />

            <Button
              title="Continue with Facebook"
              onPress={signInWithFacebook}
              style={styles.socialButton}
              textStyle={styles.socialButtonText}
              leftIcon={<Ionicons name="logo-facebook" size={iconSize} color={iconColor} />}
              disabled={isLoading}
            />
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Don't have an account?</Text>
            <TouchableOpacity onPress={handleRegister} disabled={isLoading}>
              <Text style={[styles.registerText, isLoading && styles.disabledText]}>
                 Register
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingVertical: 30,
    justifyContent: 'center',
  },
  header: {
    alignItems: "center",
    marginBottom: 30,
  },
  logo: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 20,
    backgroundColor: colors.border,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: colors.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: "center",
    paddingHorizontal: 15,
  },
  formContainer: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 20,
  },
  forgotPasswordContainer: {
    alignItems: 'flex-end',
    marginTop: 12,
    marginBottom: 18,
  },
  forgotPasswordText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '500',
  },
  separatorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  separatorLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.border,
  },
  separatorText: {
    marginHorizontal: 10,
    color: colors.textSecondary,
    fontSize: 12,
    fontWeight: '600',
  },
  socialButtons: {
    gap: 15, 
  },
  socialButton: {
    backgroundColor: colors.card,
    borderColor: colors.border,
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  socialButtonText: {
    color: colors.text,
    marginLeft: 10,
    fontWeight: '500',
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: 'center',
    marginTop: 25,
    paddingBottom: 10,
  },
  footerText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  registerText: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: "600",
    marginLeft: 5, 
  },
  disabledText: {
    color: colors.textSecondary, 
  },
});