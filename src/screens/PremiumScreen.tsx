import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../context/AuthContext';
import { usePremium } from '../hooks/usePremium';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { PREMIUM_PLANS, ONE_TIME_PRODUCTS, purchasePlan, purchaseProduct, showRewardedAd } from '../services/monetization';
import { colors, spacing, fontSize, radius } from '../theme/colors';

export default function PremiumScreen() {
  const { isPremium, premiumTier } = usePremium();
  const { updateUserProfile } = useAuth();
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [loading, setLoading] = useState<string | null>(null);

  const handleSubscribe = async (planId: string) => {
    setSelectedPlan(planId);
    setLoading(planId);
    const result = await purchasePlan(planId);
    setLoading(null);
    if (result.success) {
      await updateUserProfile({
        isPremium: true,
        premiumTier: planId,
        adFree: true,
      });
      Alert.alert('Subscribed', `You are now subscribed to the ${planId} plan!`);
    } else {
      Alert.alert('Purchase failed', result.error || 'Try again later');
    }
  };

  const handleBuyProduct = async (productId: string) => {
    setLoading(productId);
    const result = await purchaseProduct(productId);
    setLoading(null);
    if (result.success) {
      Alert.alert('Success', 'Item purchased successfully!');
    } else {
      Alert.alert('Purchase failed', result.error || 'Try again later');
    }
  };

  const handleWatchAd = async () => {
    const result = await showRewardedAd();
    if (result.success) {
      Alert.alert('Reward!', 'You earned a free coaching credit.');
    }
  };

  if (isPremium) {
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.scroll}>
          <LinearGradient colors={colors.premiumGradient} style={styles.header}>
            <Text style={styles.headerTitle}>You're Premium! 🎉</Text>
            <Text style={styles.headerSubtitle}>Plan: {premiumTier || 'Active'}</Text>
          </LinearGradient>
          <Text style={styles.sectionTitle}>Premium Perks</Text>
          {['AI profile analysis', 'Unlimited bio templates', 'Premium photo tips', 'AI dating coach', 'Ad-free experience'].map((perk) => (
            <Card key={perk}>
              <Text style={styles.perk}>✓ {perk}</Text>
            </Card>
          ))}
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <LinearGradient colors={colors.premiumGradient} style={styles.header}>
          <Text style={styles.headerTitle}>Go Premium</Text>
          <Text style={styles.headerSubtitle}>Unlock everything and get more matches.</Text>
        </LinearGradient>

        <Text style={styles.sectionTitle}>Subscription Plans</Text>
        {PREMIUM_PLANS.map((plan) => (
          <TouchableOpacity key={plan.id} onPress={() => setSelectedPlan(plan.id)}>
            <Card style={{
              ...styles.planCard,
              ...(selectedPlan === plan.id ? styles.planSelected : {}),
              ...(plan.popular ? styles.popularCard : {}),
            }}>
              {plan.popular && <Text style={styles.popularBadge}>MOST POPULAR</Text>}
              <View style={styles.planHeader}>
                <Text style={styles.planTitle}>{plan.title}</Text>
                <Text style={styles.planPrice}>{plan.price}<Text style={styles.period}>/{plan.period}</Text></Text>
              </View>
              {plan.features.map((feature, index) => (
                <Text key={index} style={styles.feature}>✓ {feature}</Text>
              ))}
              <Button
                title={selectedPlan === plan.id ? 'Selected' : 'Choose Plan'}
                variant="premium"
                loading={loading === plan.id}
                onPress={() => handleSubscribe(plan.id)}
                style={styles.planButton}
              />
            </Card>
          </TouchableOpacity>
        ))}

        <Text style={styles.sectionTitle}>One-Time Purchases</Text>
        {ONE_TIME_PRODUCTS.map((product) => (
          <Card key={product.id} style={styles.productCard}>
            <Text style={styles.productTitle}>{product.title}</Text>
            <Text style={styles.productDescription}>{product.description}</Text>
            <Button
              title={`Buy ${product.price}`}
              variant="secondary"
              loading={loading === product.id}
              onPress={() => handleBuyProduct(product.id)}
            />
          </Card>
        ))}

        <TouchableOpacity onPress={handleWatchAd}>
          <Card style={styles.adCard}>
            <Text style={styles.adTitle}>Watch a short ad</Text>
            <Text style={styles.adDescription}>Earn a free coaching credit or unlock a premium feature.</Text>
          </Card>
        </TouchableOpacity>
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
  header: {
    padding: spacing.lg,
    borderRadius: radius.lg,
    marginBottom: spacing.lg,
  },
  headerTitle: {
    fontSize: fontSize.xl,
    fontWeight: 'bold',
    color: '#fff',
  },
  headerSubtitle: {
    fontSize: fontSize.md,
    color: 'rgba(255,255,255,0.9)',
    marginTop: spacing.xs,
  },
  sectionTitle: {
    fontSize: fontSize.lg,
    fontWeight: 'bold',
    color: colors.text,
    marginTop: spacing.lg,
    marginBottom: spacing.md,
  },
  planCard: {
    marginBottom: spacing.md,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  planSelected: {
    borderColor: colors.premium,
  },
  popularCard: {
    borderColor: colors.accent,
  },
  popularBadge: {
    color: colors.accent,
    fontSize: fontSize.xs,
    fontWeight: 'bold',
    marginBottom: spacing.sm,
  },
  planHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  planTitle: {
    fontSize: fontSize.lg,
    fontWeight: 'bold',
    color: colors.text,
  },
  planPrice: {
    fontSize: fontSize.xl,
    fontWeight: 'bold',
    color: colors.premium,
  },
  period: {
    fontSize: fontSize.sm,
    color: colors.textLight,
    fontWeight: 'normal',
  },
  feature: {
    fontSize: fontSize.sm,
    color: colors.textLight,
    marginBottom: spacing.xs,
  },
  planButton: {
    marginTop: spacing.md,
  },
  productCard: {
    marginBottom: spacing.md,
  },
  productTitle: {
    fontSize: fontSize.md,
    fontWeight: '600',
    color: colors.text,
  },
  productDescription: {
    fontSize: fontSize.sm,
    color: colors.textLight,
    marginVertical: spacing.sm,
  },
  adCard: {
    marginBottom: spacing.md,
    backgroundColor: colors.accent,
  },
  adTitle: {
    fontSize: fontSize.md,
    fontWeight: '600',
    color: colors.text,
  },
  adDescription: {
    fontSize: fontSize.sm,
    color: colors.text,
    marginTop: spacing.xs,
  },
  perk: {
    fontSize: fontSize.md,
    color: colors.text,
    fontWeight: '500',
  },
});
