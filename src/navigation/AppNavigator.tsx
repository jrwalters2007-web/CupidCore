import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from '../context/AuthContext';
import { ActivityIndicator, View, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';

import LoginScreen from '../screens/LoginScreen';
import SignupScreen from '../screens/SignupScreen';
import HomeScreen from '../screens/HomeScreen';
import ProfileBuilderScreen from '../screens/ProfileBuilderScreen';
import AIAdviceScreen from '../screens/AIAdviceScreen';
import TemplatesScreen from '../screens/TemplatesScreen';
import PhotoTipsScreen from '../screens/PhotoTipsScreen';
import PremiumScreen from '../screens/PremiumScreen';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: colors.background },
          headerTintColor: colors.text,
          headerTitleStyle: { fontWeight: 'bold' },
        }}
      >
        {user ? (
          <>
            <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
            <Stack.Screen name="ProfileBuilder" component={ProfileBuilderScreen} options={{ title: 'Profile Builder' }} />
            <Stack.Screen name="AIAdvice" component={AIAdviceScreen} options={{ title: 'AI Coach' }} />
            <Stack.Screen name="Templates" component={TemplatesScreen} options={{ title: 'Bio Templates' }} />
            <Stack.Screen name="PhotoTips" component={PhotoTipsScreen} options={{ title: 'Photo Tips' }} />
            <Stack.Screen name="Premium" component={PremiumScreen} options={{ title: 'Premium' }} />
          </>
        ) : (
          <>
            <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
            <Stack.Screen name="Signup" component={SignupScreen} options={{ headerShown: false }} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
});
