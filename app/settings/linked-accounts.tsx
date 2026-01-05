import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useAuthStore } from '@/store/auth-store';
import { supabase } from '@/lib/supabase';
import {
  ArrowLeft,
  Link2,
  Unlink,
  Check,
  AlertCircle,
  Smartphone,
} from 'lucide-react-native';
import { colors } from '@/constants/Colors';
import { LinkedAccount } from '@/types/auth';

interface SocialProvider {
  id: string;
  name: string;
  color: string;
  backgroundColor: string;
  icon: React.ReactNode;
}

const socialProviders: SocialProvider[] = [
  {
    id: 'google',
    name: 'Google',
    color: '#DB4437',
    backgroundColor: '#FEE2E2',
    icon: (
      <View style={[styles.providerIcon, { backgroundColor: '#FEE2E2' }]}>
        <Text style={[styles.providerIconText, { color: '#DB4437' }]}>G</Text>
      </View>
    ),
  },
  {
    id: 'facebook',
    name: 'Facebook',
    color: '#1877F2',
    backgroundColor: '#DBEAFE',
    icon: (
      <View style={[styles.providerIcon, { backgroundColor: '#DBEAFE' }]}>
        <Text style={[styles.providerIconText, { color: '#1877F2' }]}>f</Text>
      </View>
    ),
  },
  {
    id: 'apple',
    name: 'Apple',
    color: '#000000',
    backgroundColor: '#F3F4F6',
    icon: (
      <View style={[styles.providerIcon, { backgroundColor: '#F3F4F6' }]}>
        <Text style={[styles.providerIconText, { color: '#000000' }]}></Text>
      </View>
    ),
  },
  {
    id: 'twitter',
    name: 'Twitter/X',
    color: '#1DA1F2',
    backgroundColor: '#E0F2FE',
    icon: (
      <View style={[styles.providerIcon, { backgroundColor: '#E0F2FE' }]}>
        <Text style={[styles.providerIconText, { color: '#1DA1F2' }]}>𝕏</Text>
      </View>
    ),
  },
];

export default function LinkedAccountsScreen() {
  const router = useRouter();
  const { user } = useAuthStore();
  
  const [linkedAccounts, setLinkedAccounts] = useState<LinkedAccount[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [linkingProvider, setLinkingProvider] = useState<string | null>(null);
  const [unlinkingProvider, setUnlinkingProvider] = useState<string | null>(null);

  useEffect(() => {
    loadLinkedAccounts();
  }, []);

  const loadLinkedAccounts = async () => {
    try {
      // Get linked identities from Supabase Auth
      const { data: { user: authUser }, error } = await supabase.auth.getUser();
      
      if (error) throw error;

      // Map identities to linked accounts
      const accounts: LinkedAccount[] = authUser?.identities?.map((identity) => ({
        id: identity.id,
        provider: identity.provider as LinkedAccount['provider'],
        email: identity.identity_data?.email || '',
        linkedAt: identity.created_at || new Date().toISOString(),
      })) || [];

      setLinkedAccounts(accounts);
    } catch (error) {
      console.error('Error loading linked accounts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const isLinked = (providerId: string) => {
    return linkedAccounts.some((account) => account.provider === providerId);
  };

  const getLinkedAccount = (providerId: string) => {
    return linkedAccounts.find((account) => account.provider === providerId);
  };

  const handleLinkAccount = async (providerId: string) => {
    if (isLinked(providerId)) return;

    setLinkingProvider(providerId);
    try {
      // Initiate OAuth flow
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: providerId as any,
        options: {
          skipBrowserRedirect: true,
          redirectTo: 'muniserve://auth/callback',
        },
      });

      if (error) throw error;

      // Handle OAuth flow - this will open a browser
      // After successful auth, the account will be linked
      Alert.alert(
        'Link Account',
        `Opening ${socialProviders.find((p) => p.id === providerId)?.name} to link your account...`,
        [
          {
            text: 'OK',
            onPress: () => {
              // Open OAuth URL in browser
              // Linking.openURL(data.url);
            },
          },
        ]
      );
    } catch (error: any) {
      console.error('Link error:', error);
      Alert.alert('Error', error.message || 'Failed to link account. Please try again.');
    } finally {
      setLinkingProvider(null);
    }
  };

  const handleUnlinkAccount = async (providerId: string) => {
    const linkedAccount = getLinkedAccount(providerId);
    if (!linkedAccount) return;

    // Check if this is the only auth method
    if (linkedAccounts.length === 1 && !user?.email) {
      Alert.alert(
        'Cannot Unlink',
        'You cannot unlink this account because it is your only sign-in method. Please add a password or link another account first.'
      );
      return;
    }

    Alert.alert(
      'Unlink Account',
      `Are you sure you want to unlink your ${
        socialProviders.find((p) => p.id === providerId)?.name
      } account?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Unlink',
          style: 'destructive',
          onPress: async () => {
            setUnlinkingProvider(providerId);
            try {
              // Unlink identity
              const { error } = await supabase.auth.unlinkIdentity({
                provider: providerId as any,
              } as any);

              if (error) throw error;

              // Update local state
              setLinkedAccounts((prev) =>
                prev.filter((account) => account.provider !== providerId)
              );

              Alert.alert('Success', 'Account unlinked successfully.');
            } catch (error: any) {
              console.error('Unlink error:', error);
              Alert.alert('Error', error.message || 'Failed to unlink account. Please try again.');
            } finally {
              setUnlinkingProvider(null);
            }
          },
        },
      ]
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Loading linked accounts...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ArrowLeft size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Linked Accounts</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Info Card */}
        <Card style={styles.infoCard}>
          <View style={styles.infoContent}>
            <Link2 size={24} color={colors.primary} />
            <View style={styles.infoText}>
              <Text style={styles.infoTitle}>Connected Accounts</Text>
              <Text style={styles.infoDescription}>
                Link your social accounts for quick and easy sign-in. You can unlink them at any time.
              </Text>
            </View>
          </View>
        </Card>

        {/* Primary Login */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Primary Login</Text>
          <Card style={styles.primaryCard}>
            <View style={styles.primaryContent}>
              <View style={styles.primaryIcon}>
                <Smartphone size={24} color={colors.primary} />
              </View>
              <View style={styles.primaryInfo}>
                <Text style={styles.primaryTitle}>Email/Password</Text>
                <Text style={styles.primaryEmail}>{user?.email}</Text>
              </View>
              <View style={styles.primaryBadge}>
                <Check size={16} color="#10B981" />
              </View>
            </View>
          </Card>
        </View>

        {/* Social Accounts */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Social Accounts</Text>
          <Card style={styles.socialCard}>
            {socialProviders.map((provider, index) => {
              const linked = isLinked(provider.id);
              const linkedAccount = getLinkedAccount(provider.id);
              const isLinking = linkingProvider === provider.id;
              const isUnlinking = unlinkingProvider === provider.id;

              return (
                <Animated.View
                  key={provider.id}
                  entering={FadeInDown.delay(index * 100).duration(300)}
                >
                  <View
                    style={[
                      styles.providerItem,
                      index < socialProviders.length - 1 && styles.providerItemBorder,
                    ]}
                  >
                    <View style={styles.providerLeft}>
                      {provider.icon}
                      <View style={styles.providerInfo}>
                        <Text style={styles.providerName}>{provider.name}</Text>
                        {linked && linkedAccount && (
                          <Text style={styles.providerEmail}>
                            {linkedAccount.email || `Linked on ${formatDate(linkedAccount.linkedAt)}`}
                          </Text>
                        )}
                      </View>
                    </View>

                    {linked ? (
                      <TouchableOpacity
                        style={styles.unlinkButton}
                        onPress={() => handleUnlinkAccount(provider.id)}
                        disabled={isUnlinking}
                      >
                        {isUnlinking ? (
                          <ActivityIndicator size="small" color="#EF4444" />
                        ) : (
                          <>
                            <Unlink size={16} color="#EF4444" />
                            <Text style={styles.unlinkText}>Unlink</Text>
                          </>
                        )}
                      </TouchableOpacity>
                    ) : (
                      <TouchableOpacity
                        style={[styles.linkButton, { backgroundColor: provider.backgroundColor }]}
                        onPress={() => handleLinkAccount(provider.id)}
                        disabled={isLinking}
                      >
                        {isLinking ? (
                          <ActivityIndicator size="small" color={provider.color} />
                        ) : (
                          <>
                            <Link2 size={16} color={provider.color} />
                            <Text style={[styles.linkText, { color: provider.color }]}>Link</Text>
                          </>
                        )}
                      </TouchableOpacity>
                    )}
                  </View>
                </Animated.View>
              );
            })}
          </Card>
        </View>

        {/* Security Notice */}
        <Card style={styles.securityCard}>
          <View style={styles.securityContent}>
            <AlertCircle size={20} color="#F59E0B" />
            <View style={styles.securityText}>
              <Text style={styles.securityTitle}>Security Tip</Text>
              <Text style={styles.securityDescription}>
                Linking multiple accounts provides backup sign-in options if you lose access to one.
              </Text>
            </View>
          </View>
        </Card>

        {/* Benefits Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Benefits of Linking</Text>
          <Card style={styles.benefitsCard}>
            <View style={styles.benefitItem}>
              <Check size={18} color="#10B981" />
              <Text style={styles.benefitText}>Quick one-tap sign-in</Text>
            </View>
            <View style={styles.benefitItem}>
              <Check size={18} color="#10B981" />
              <Text style={styles.benefitText}>Backup access to your account</Text>
            </View>
            <View style={styles.benefitItem}>
              <Check size={18} color="#10B981" />
              <Text style={styles.benefitText}>Secure authentication</Text>
            </View>
            <View style={styles.benefitItem}>
              <Check size={18} color="#10B981" />
              <Text style={styles.benefitText}>Easy account recovery</Text>
            </View>
          </Card>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#6B7280',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },
  placeholder: {
    width: 40,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  infoCard: {
    marginBottom: 24,
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#BFDBFE',
    padding: 16,
  },
  infoContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  infoText: {
    flex: 1,
    marginLeft: 12,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E40AF',
  },
  infoDescription: {
    fontSize: 14,
    color: '#3B82F6',
    marginTop: 4,
    lineHeight: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
    marginBottom: 8,
    marginLeft: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  primaryCard: {
    padding: 16,
  },
  primaryContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  primaryIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryInfo: {
    flex: 1,
    marginLeft: 12,
  },
  primaryTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  primaryEmail: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 2,
  },
  primaryBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#ECFDF5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  socialCard: {
    padding: 0,
    overflow: 'hidden',
  },
  providerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  providerItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  providerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  providerIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  providerIconText: {
    fontSize: 18,
    fontWeight: '700',
  },
  providerInfo: {
    marginLeft: 12,
    flex: 1,
  },
  providerName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1F2937',
  },
  providerEmail: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 2,
  },
  linkButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 6,
  },
  linkText: {
    fontSize: 14,
    fontWeight: '600',
  },
  unlinkButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#FEF2F2',
    gap: 6,
  },
  unlinkText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#EF4444',
  },
  securityCard: {
    marginBottom: 24,
    backgroundColor: '#FFFBEB',
    borderWidth: 1,
    borderColor: '#FDE68A',
    padding: 16,
  },
  securityContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  securityText: {
    flex: 1,
    marginLeft: 12,
  },
  securityTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#92400E',
  },
  securityDescription: {
    fontSize: 13,
    color: '#A16207',
    marginTop: 2,
    lineHeight: 18,
  },
  benefitsCard: {
    padding: 16,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 8,
  },
  benefitText: {
    fontSize: 15,
    color: '#374151',
  },
});
