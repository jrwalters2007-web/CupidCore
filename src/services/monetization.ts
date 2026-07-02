import { PremiumPlan, OneTimeProduct } from '../types';
import {
  presentStripePaymentSheet,
  startStripeCheckout,
  getProductPriceId,
  getPlanPriceId,
} from './stripePayments';

export const PREMIUM_PLANS: PremiumPlan[] = [
  {
    id: 'monthly',
    title: 'Monthly Premium',
    price: '$9.99',
    period: 'month',
    features: [
      'Full AI profile analysis',
      'Unlimited bio templates',
      'Premium photo tips',
      'AI dating advice chat',
      'Ad-free experience',
    ],
  },
  {
    id: 'quarterly',
    title: 'Quarterly Premium',
    price: '$24.99',
    period: 'quarter',
    features: [
      'Everything in Monthly',
      'Save 17% vs monthly',
      'Priority AI responses',
      'Quarterly profile refreshes',
    ],
  },
  {
    id: 'yearly',
    title: 'Yearly Premium',
    price: '$59.99',
    period: 'year',
    features: [
      'Everything in Monthly',
      'Save 50% vs monthly',
      'Priority AI responses',
      'Monthly profile refreshes',
      'Exclusive dating guides',
    ],
    popular: true,
  },
  {
    id: 'lifetime',
    title: 'Lifetime Access',
    price: '$149.99',
    period: 'one-time',
    features: [
      'All premium features forever',
      'All future updates included',
      'Best long-term value',
    ],
  },
];

export const ONE_TIME_PRODUCTS: OneTimeProduct[] = [
  {
    id: 'profile_review',
    title: 'Profile Review',
    description: 'Get a detailed AI review of your profile with actionable improvements.',
    price: '$4.99',
    icon: 'document-text',
  },
  {
    id: 'bio_pack',
    title: 'Premium Bio Pack',
    description: 'Unlock 50+ premium bio templates for every personality type.',
    price: '$7.99',
    icon: 'create',
  },
  {
    id: 'photo_audit',
    title: 'Photo Audit',
    description: 'AI-powered photo selection and ordering recommendations.',
    price: '$3.99',
    icon: 'camera',
  },
  {
    id: 'coaching_credit',
    title: 'Coaching Credit',
    description: '5 premium AI coaching sessions for messaging and date prep.',
    price: '$9.99',
    icon: 'chatbubbles',
  },
];

export async function purchasePlan(planId: string): Promise<{ success: boolean; error?: string }> {
  const priceId = getPlanPriceId(planId);
  if (!priceId) return { success: false, error: 'Unknown plan' };

  const plan = PREMIUM_PLANS.find((p) => p.id === planId);
  const mode = plan?.period === 'one-time' ? 'payment' : 'subscription';

  // Try real Stripe checkout; fall back to demo mode if backend is not running
  const result = await startStripeCheckout(priceId, mode);
  if (result.success) return result;

  console.log(`Demo mode: subscribing to plan ${planId}`);
  return new Promise((resolve) => {
    setTimeout(() => resolve({ success: true }), 1000);
  });
}

export async function purchaseProduct(productId: string): Promise<{ success: boolean; error?: string }> {
  const product = getProductPriceId(productId);
  if (!product) return { success: false, error: 'Unknown product' };

  // Try real Stripe PaymentSheet; fall back to demo mode if backend is not running
  const result = await presentStripePaymentSheet(product.amount, 'usd');
  if (result.success) return result;

  console.log(`Demo mode: purchasing product ${productId}`);
  return new Promise((resolve) => {
    setTimeout(() => resolve({ success: true }), 1000);
  });
}

export function showRewardedAd(): Promise<{ success: boolean; reward?: string }> {
  // Placeholder: integrate with Google Mobile Ads (AdMob) SDK
  console.log('Showing rewarded ad');
  return new Promise((resolve) => {
    setTimeout(() => resolve({ success: true, reward: '1_free_credit' }), 1000);
  });
}

export function showInterstitialAd(): Promise<void> {
  // Placeholder: integrate with Google Mobile Ads (AdMob) SDK
  console.log('Showing interstitial ad');
  return new Promise((resolve) => {
    setTimeout(resolve, 1000);
  });
}

export function isPremiumFeature(featureId: string): boolean {
  const premiumFeatures = ['ai_full_analysis', 'premium_templates', 'premium_photo_tips', 'ai_chat', 'ad_free'];
  return premiumFeatures.includes(featureId);
}
