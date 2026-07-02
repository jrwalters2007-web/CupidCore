import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { usePremium } from '../hooks/usePremium';
import { useAuth } from '../context/AuthContext';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { PHOTO_TIPS } from '../services/profileService';
import { showRewardedAd, purchaseProduct } from '../services/monetization';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, spacing, fontSize, radius } from '../theme/colors';

export default function PhotoTipsScreen() {
  const { isPremium, canAccessPremium } = usePremium();
  const { profile, updateUserProfile } = useAuth();
  const [expanded, setExpanded] = useState<string | null>(null);
  const [unlockedCategories, setUnlockedCategories] = useState<string[]>([]);

  const toggleExpand = (id: string) => {
    setExpanded(expanded === id ? null : id);
  };

  const canAccessTip = (tip: { id: string; premium: boolean; category: string }) => {
    if (!tip.premium) return true;
    return isPremium || unlockedCategories.includes(tip.category);
  };

  const handleWatchAd = async () => {
    const result = await showRewardedAd();
    if (result.success) {
      Alert.alert('Reward Unlocked', 'All premium photo tips are now unlocked for 24 hours!');
      setUnlockedCategories(['Style', 'Authenticity', 'Strategy']);
    }
  };

  const handleUnlockAll = async () => {
    const result = await purchaseProduct('photo_audit');
    if (result.success) {
      await updateUserProfile({ adFree: true });
      setUnlockedCategories(['Style', 'Authenticity', 'Strategy']);
      Alert.alert('Success', 'Photo audit unlocked!');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.title}>Photo Tips</Text>
        <Text style={styles.subtitle}>The right photos can double your matches. Here's what works.</Text>

        {!isPremium && (
          <LinearGradient colors={colors.premiumGradient} style={styles.cta}>
            <Text style={styles.ctaTitle}>Premium Photo Audit</Text>
            <Text style={styles.ctaSubtitle}>Unlock all tips and get AI-powered photo ordering advice.</Text>
            <View style={styles.ctaButtons}>
              <Button title="Watch Ad to Unlock" onPress={handleWatchAd} variant="secondary" style={styles.ctaButton} />
              <Button title="Buy Photo Audit — $3.99" onPress={handleUnlockAll} variant="light" style={styles.ctaButton} />
            </View>
          </LinearGradient>
        )}

        {PHOTO_TIPS.map((tip) => {
          const unlocked = canAccessTip(tip);
          const isExpanded = expanded === tip.id;
          return (
            <TouchableOpacity key={tip.id} onPress={() => unlocked && toggleExpand(tip.id)}>
              <Card style={unlocked ? styles.card : styles.cardLocked}>
                <View style={styles.headerRow}>
                  <Text style={styles.category}>{tip.category}</Text>
                  {tip.premium && !unlocked && (
                    <View style={styles.lockBadge}>
                      <Text style={styles.lockText}>PREMIUM</Text>
                    </View>
                  )}
                </View>
                <Text style={styles.titleText}>{tip.title}</Text>
                {isExpanded && unlocked && (
                  <Text style={styles.description}>{tip.description}</Text>
                )}
                {!unlocked && <Text style={styles.lockedText}>Tap to unlock premium tip</Text>}
              </Card>
            </TouchableOpacity>
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
  ctaButtons: {
    gap: spacing.sm,
  },
  ctaButton: {
    marginTop: spacing.sm,
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
  titleText: {
    fontSize: fontSize.md,
    fontWeight: '600',
    color: colors.text,
  },
  description: {
    fontSize: fontSize.md,
    color: colors.textLight,
    marginTop: spacing.sm,
    lineHeight: 22,
  },
  lockedText: {
    fontSize: fontSize.sm,
    color: colors.premium,
    marginTop: spacing.sm,
    fontStyle: 'italic',
  },
});
