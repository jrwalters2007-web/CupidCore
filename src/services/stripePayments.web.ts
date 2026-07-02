import { Alert, Linking } from 'react-native';

const BACKEND_URL = 'https://cupidcore-api.up.railway.app';

export async function fetchPaymentSheetParams(amountInCents: number, currency = 'usd') {
  const response = await fetch(`${BACKEND_URL}/create-payment-intent`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ amount: amountInCents, currency }),
  });
  if (!response.ok) {
    throw new Error(`Backend error: ${response.status}`);
  }
  return response.json();
}

export async function presentStripePaymentSheet(
  amountInCents: number,
  currency = 'usd'
): Promise<{ success: boolean; error?: string }> {
  Alert.alert('Stripe on Web', 'Stripe PaymentSheet is only supported on native mobile. Please run on iOS/Android or use Stripe Checkout instead.');
  return { success: false, error: 'Stripe PaymentSheet not supported on web' };
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
    Alert.alert('Stripe Checkout Unavailable', 'Make sure your backend server is running.');
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
