import { useAuth } from '../context/AuthContext';

export function usePremium() {
  const { profile } = useAuth();
  const isPremium = profile?.isPremium ?? false;
  const adFree = profile?.adFree ?? false;
  const premiumTier = profile?.premiumTier;

  return {
    isPremium,
    adFree,
    premiumTier,
    canAccessPremium: (featureId: string) => {
      const premiumFeatures = ['ai_full_analysis', 'premium_templates', 'premium_photo_tips', 'ai_chat', 'ad_free'];
      if (!premiumFeatures.includes(featureId)) return true;
      return isPremium;
    },
  };
}
