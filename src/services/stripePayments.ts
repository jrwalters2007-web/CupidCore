import { Platform, Alert, Linking } from 'react-native';

const BACKEND_URL = 'https://cupidcore-production.up.railway.app';

let initPaymentSheet: (params: any) => Promise<{ error?: any }> = async () => ({ error: undefined });
let presentPaymentSheet: (options?: any) => Promise<{ error?: any }> = async () => ({ error: undefined });

if (Platform.OS !== 'web') {
  try {
    const Stripe = require('@stripe/stripe-react-native');
    initPaymentSheet = Stripe.initPaymentSheet;
    presentPaymentSheet = Stripe.presentPaymentSheet;
  } catch {
    // Stripe is not available on web
  }
}

export async function fetchPaymentSheetParams(amountInCents: number, currency = 'usd') {
  const response = await fetch(`${BACKEND_URL}/create-payment-intent`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ amount: amountInCents, currency }),
  });
  if (!response.ok) {
    throw new Error(`Backend error: ${response.status}`);
  }
  const { paymentIntent, ephemeralKey, customer } = await response.json();
  return { paymentIntent, ephemeralKey, customer };
}

export async function presentStripePaymentSheet(
  amountInCents: number,
  currency = 'usd'
): Promise<{ success: boolean; error?: string }> {
  if (Platform.OS === 'web') {
    return { success: false, error: 'Stripe PaymentSheet is not supported on web' };
  }

  try {
    const { paymentIntent, ephemeralKey, customer } = await fetchPaymentSheetParams(amountInCents, currency);
    const { error: initError } = await initPaymentSheet({
      paymentIntentClientSecret: paymentIntent,
      customerId: customer,
      customerEphemeralKeySecret: ephemeralKey,
      merchantDisplayName: 'CupidCore',
      allowsDelayedPaymentMethods: true,
    });
    if (initError) {
      return { success: false, error: initError.message };
    }
    const { error: presentError } = await presentPaymentSheet();
    if (presentError) {
      if (presentError.code === 'Canceled') {
        return { success: false, error: 'Payment canceled' };
      }
      return { success: false, error: presentError.message };
    }
    return { success: true };
  } catch (err: any) {
    Alert.alert(
      'Stripe Setup Required',
      'Make sure your backend server is running and the BACKEND_URL is correct. Demo mode will be used instead.'
    );
    return { success: false, error: err.message };
  }
}

export async function startStripeCheckout(
  priceId: string,
  mode: 'subscription' | 'payment' = 'subscription'
): Promise<{ success: boolean; error?: string }> {
  try {
    const response = await fetch(`${BACKEND_URL}/create-checkout-session`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ priceId, mode }),
    });
    if (!response.ok) {
      throw new Error(`Backend error: ${response.status}`);
    }
    const { url } = await response.json();
    if (url) {
      await Linking.openURL(url);
      return { success: true };
    }
    return { success: false, error: 'No checkout URL returned' };
  } catch (err: any) {
    Alert.alert(
      'Stripe Checkout Unavailable',
      'Make sure your backend server is running and the BACKEND_URL is correct. Demo mode will be used instead.'
    );
    return { success: false, error: err.message };
  }
}

export function getProductPriceId(productId: string): { priceId: string; amount: number } | null {
  const map: Record<string, { priceId: string; amount: number }> = {
    profile_review: { priceId: 'price_profile_review', amount: 499 },
    bio_pack: { priceId: 'price_bio_pack', amount: 799 },
    photo_audit: { priceId: 'price_photo_audit', amount: 399 },
    coaching_credit: { priceId: 'price_coaching_credit', amount: 999 },
  };
  return map[productId] || null;
}

export function getPlanPriceId(planId: string): string | null {
  const map: Record<string, string> = {
    monthly: 'price_1ToRSF2VcQisA5Kre3USok5R',
    quarterly: 'price_1ToRVJ2VcQisA5Krx0rxNbL6',
    yearly: 'price_1ToRUd2VcQisA5KrYIyKB5n6',
    lifetime: 'price_1ToYK42VcQisA5Kr9HwurYkv',
  };
  return map[planId] || null;
}
