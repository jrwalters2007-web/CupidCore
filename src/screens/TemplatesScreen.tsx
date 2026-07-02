import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { usePremium } from '../hooks/usePremium';
import { useAuth } from '../context/AuthContext';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { BIO_TEMPLATES } from '../services/profileService';
import { purchaseProduct } from '../services/monetization';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, spacing, fontSize, radius } from '../theme/colors';

export default function TemplatesScreen() {
  const { isPremium } = usePremium();
  const { profile, updateUserProfile } = useAuth();
  const purchasedTemplates = profile?.purchasedTemplates || [];

  const canUseTemplate = (template: { id: string; premium: boolean }) => {
    if (!template.premium) return true;
    return isPremium || purchasedTemplates.includes(template.id);
  };

  const handleUseTemplate = (content: string) => {
    Alert.alert('Use Template', 'Copy this bio to your clipboard? (In a real app, this would copy to clipboard.)', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Use', onPress: () => updateUserProfile({ bio: content }) },
    ]);
  };

  const handleUnlockAll = async () => {
    const result = await purchaseProduct('bio_pack');
    if (result.success) {
      await updateUserProfile({ purchasedTemplates: BIO_TEMPLATES.filter((t) => t.premium).map((t) => t.id) });
      Alert.alert('Success', 'Premium bio pack unlocked!');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.title}>Bio Templates</Text>
        <Text style={styles.subtitle}>Proven bios for every personality. Free templates are available to everyone.</Text>

        {!isPremium && (
          <LinearGradient colors={colors.premiumGradient} style={styles.cta}>
            <Text style={styles.ctaTitle}>Unlock Premium Templates</Text>
            <Text style={styles.ctaSubtitle}>Get 50+ premium templates with one purchase.</Text>
            <Button title="Unlock Bio Pack — $7.99" onPress={handleUnlockAll} variant="light" style={styles.ctaButton} />
          </LinearGradient>
        )}

        {BIO_TEMPLATES.map((template) => {
          const unlocked = canUseTemplate(template);
          return (
            <Card key={template.id} style={unlocked ? styles.card : styles.cardLocked}>
              <View style={styles.headerRow}>
                <Text style={styles.category}>{template.category}</Text>
                {template.premium && !unlocked && (
                  <View style={styles.lockBadge}>
                    <Text style={styles.lockText}>PREMIUM</Text>
                  </View>
                )}
              </View>
              <Text style={styles.content}>{template.content}</Text>
              <Button
                title={unlocked ? 'Use This Bio' : 'Unlock Premium'}
                variant={unlocked ? 'primary' : 'premium'}
                onPress={() => unlocked ? handleUseTemplate(template.content) : handleUnlockAll()}
              />
            </Card>
          );
        })}
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
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  title: {
    fontSize: fontSize.xl,
    fontWeight: 'bold',
    color: colors.text,
  },
  subtitle: {
    fontSize: fontSize.md,
    color: colors.textLight,
    marginBottom: spacing.lg,
  },
  cta: {
    padding: spacing.lg,
    borderRadius: radius.lg,
    marginBottom: spacing.lg,
  },
  ctaTitle: {
    fontSize: fontSize.lg,
    fontWeight: 'bold',
    color: '#fff',
  },
  ctaSubtitle: {
    fontSize: fontSize.md,
    color: 'rgba(255,255,255,0.9)',
    marginVertical: spacing.sm,
  },
  ctaButton: {
    marginTop: spacing.sm,
    backgroundColor: '#fff',
  },
  card: {
    marginBottom: spacing.md,
  },
  cardLocked: {
    marginBottom: spacing.md,
    opacity: 0.85,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  category: {
    fontSize: fontSize.sm,
    color: colors.primary,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  lockBadge: {
    backgroundColor: colors.premium,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: radius.full,
  },
  lockText: {
    color: '#fff',
    fontSize: fontSize.xs,
    fontWeight: 'bold',
  },
  content: {
    fontSize: fontSize.md,
    color: colors.text,
    marginBottom: spacing.md,
    lineHeight: 22,
  },
});
