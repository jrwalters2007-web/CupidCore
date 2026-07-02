import React from 'react';
import { Platform } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import Constants from 'expo-constants';
import { AuthProvider } from './src/context/AuthContext';
import AppNavigator from './src/navigation/AppNavigator';

const stripePublishableKey =
  Constants.expoConfig?.extra?.stripePublishableKey || '';

let StripeProvider: React.FC<{ publishableKey: string; children: React.ReactNode }> = ({ children }) => <>{children}</>;

if (Platform.OS !== 'web') {
  try {
    const Stripe = require('@stripe/stripe-react-native');
    StripeProvider = Stripe.StripeProvider;
  } catch {
    // Stripe is not available on web
  }
}

export default function App() {
  return (
    <StripeProvider publishableKey={stripePublishableKey}>
      <AuthProvider>
        <AppNavigator />
        <StatusBar style="auto" />
      </AuthProvider>
    </StripeProvider>
  );
}
