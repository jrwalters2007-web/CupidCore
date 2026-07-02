import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../context/AuthContext';
import { usePremium } from '../hooks/usePremium';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { colors, spacing, fontSize, radius } from '../theme/colors';

const FEATURES = [
  {
    id: 'profile',
    title: 'Profile Builder',
    description: 'Create and optimize your dating profile step by step.',
    icon: '👤',
    route: 'ProfileBuilder',
    premium: false,
  },
  {
    id: 'ai',
    title: 'AI Advice',
    description: 'Get personalized feedback and chat with a dating coach.',
    icon: '💡',
    route: 'AIAdvice',
    premium: true,
  },
  {
    id: 'templates',
    title: 'Bio Templates',
    description: 'Browse proven bio templates for every personality.',
    icon: '✍️',
    route: 'Templates',
    premium: false,
  },
  {
    id: 'photos',
    title: 'Photo Tips',
    description: 'Learn which photos get the most matches.',
    icon: '📸',
    route: 'PhotoTips',
    premium: false,
  },
  {
    id: 'premium',
    title: 'Go Premium',
    description: 'Unlock everything and remove ads.',
    icon: '💎',
    route: 'Premium',
    premium: false,
  },
];

export default function HomeScreen({ navigation }: { navigation: any }) {
  const { user, profile, logout } = useAuth();
  const { isPremium } = usePremium();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <LinearGradient colors={colors.heartGradient} style={styles.header}>
          <View style={styles.headerRow}>
            <View>
              <Text style={styles.greeting}>Hello, {profile?.displayName || user?.displayName || 'there'} 👋</Text>
              <Text style={styles.subtitle}>Ready to level up your dating profile?</Text>
            </View>
            {isPremium && (
              <View style={styles.premiumBadge}>
                <Text style={styles.premiumBadgeText}>PREMIUM</Text>
              </View>
            )}
          </View>
          {profile?.profileScore !== undefined && (
            <View style={styles.scoreContainer}>
              <Text style={styles.scoreLabel}>Profile Score</Text>
              <Text style={styles.scoreValue}>{profile.profileScore}/100</Text>
            </View>
          )}
        </LinearGradient>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Get Started</Text>
          {FEATURES.map((feature) => (
            <TouchableOpacity
              key={feature.id}
              onPress={() => navigation.navigate(feature.route)}
            >
              <Card style={styles.featureCard}>
                <View style={styles.featureRow}>
                  <Text style={styles.featureIcon}>{feature.icon}</Text>
                  <View style={styles.featureText}>
                    <View style={styles.featureHeader}>
                      <Text style={styles.featureTitle}>{feature.title}</Text>
                      {feature.premium && !isPremium && (
                        <View style={styles.lockBadge}>
                          <Text style={styles.lockText}>PRO</Text>
                        </View>
                      )}
                    </View>
                    <Text style={styles.featureDescription}>{feature.description}</Text>
                  </View>
                </View>
              </Card>
            </TouchableOpacity>
          ))}
        </View>

        {!isPremium && (
          <TouchableOpacity onPress={() => navigation.navigate('Premium')}>
            <LinearGradient colors={colors.premiumGradient} style={styles.ctaBanner}>
              <Text style={styles.ctaTitle}>Unlock Premium Features</Text>
              <Text style={styles.ctaSubtitle}>AI advice, premium templates, ad-free, and more.</Text>
            </LinearGradient>
          </TouchableOpacity>
        )}

        <View style={styles.footer}>
          <Button title="Log Out" onPress={logout} variant="outline" />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scroll: {
    paddingBottom: spacing.xl,
  },
  header: {
    padding: spacing.lg,
    borderBottomLeftRadius: radius.xl,
    borderBottomRightRadius: radius.xl,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  greeting: {
    fontSize: fontSize.xl,
    fontWeight: 'bold',
    color: '#fff',
  },
  subtitle: {
    fontSize: fontSize.md,
    color: 'rgba(255,255,255,0.9)',
    marginTop: spacing.xs,
  },
  premiumBadge: {
    backgroundColor: '#fff',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radius.full,
  },
  premiumBadgeText: {
    color: colors.premium,
    fontSize: fontSize.xs,
    fontWeight: 'bold',
  },
  scoreContainer: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: radius.md,
    padding: spacing.md,
    marginTop: spacing.lg,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  scoreLabel: {
    color: '#fff',
    fontSize: fontSize.md,
  },
  scoreValue: {
    color: '#fff',
    fontSize: fontSize.xl,
    fontWeight: 'bold',
  },
  section: {
    padding: spacing.lg,
  },
  sectionTitle: {
    fontSize: fontSize.lg,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: spacing.md,
  },
  featureCard: {
    marginVertical: spacing.xs,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  featureIcon: {
    fontSize: 28,
    marginRight: spacing.md,
  },
  featureText: {
    flex: 1,
  },
  featureHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  featureTitle: {
    fontSize: fontSize.md,
    fontWeight: '600',
    color: colors.text,
  },
  lockBadge: {
    backgroundColor: colors.premium,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: radius.full,
    marginLeft: spacing.sm,
  },
  lockText: {
    color: '#fff',
    fontSize: fontSize.xs,
    fontWeight: 'bold',
  },
  featureDescription: {
    fontSize: fontSize.sm,
    color: colors.textLight,
  },
  ctaBanner: {
    margin: spacing.lg,
    padding: spacing.lg,
    borderRadius: radius.lg,
  },
  ctaTitle: {
    fontSize: fontSize.lg,
    fontWeight: 'bold',
    color: '#fff',
  },
  ctaSubtitle: {
    fontSize: fontSize.md,
    color: 'rgba(255,255,255,0.9)',
    marginTop: spacing.xs,
  },
  footer: {
    padding: spacing.lg,
    marginTop: spacing.md,
  },
});
