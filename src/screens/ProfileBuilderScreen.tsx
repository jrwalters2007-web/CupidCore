import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { analyzeProfile } from '../services/aiAdvice';
import { saveDatingProfile, getDatingProfile } from '../services/profileService';
import { DatingProfile } from '../types';
import { colors, spacing, fontSize, radius } from '../theme/colors';

const INTERESTS = [
  'Travel', 'Fitness', 'Cooking', 'Music', 'Movies', 'Reading', 'Gaming',
  'Hiking', 'Photography', 'Art', 'Dancing', 'Sports', 'Yoga', 'Podcasts',
  'Wine', 'Coffee', 'Board Games', 'Animals', 'Writing', 'Tech',
];

export default function ProfileBuilderScreen() {
  const { user, updateUserProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [bio, setBio] = useState('');
  const [interests, setInterests] = useState<string[]>([]);
  const [photos, setPhotos] = useState<string[]>(['', '', '', '']);
  const [analysis, setAnalysis] = useState<{ score: number; feedback: string[] } | null>(null);

  useEffect(() => {
    if (user) {
      loadProfile();
    }
  }, [user]);

  const loadProfile = async () => {
    setLoading(true);
    const existing = await getDatingProfile(user!.uid);
    if (existing) {
      setBio(existing.bio || '');
      setInterests(existing.interests || []);
      setPhotos(existing.photos?.length ? existing.photos : ['', '', '', '']);
    }
    setLoading(false);
  };

  const toggleInterest = (interest: string) => {
    setInterests((prev) =>
      prev.includes(interest) ? prev.filter((i) => i !== interest) : [...prev, interest]
    );
  };

  const updatePhoto = (index: number, url: string) => {
    const updated = [...photos];
    updated[index] = url;
    setPhotos(updated);
  };

  const handleAnalyze = async () => {
    const result = analyzeProfile({ bio, photos, interests });
    setAnalysis(result);
  };

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    try {
      const profileData: DatingProfile = {
        bio,
        photos: photos.filter(Boolean),
        interests,
        redFlags: [],
        strengths: [],
        aiFeedback: analysis?.feedback.join(' ') || '',
        score: analysis?.score || 0,
      };
      await saveDatingProfile(user.uid, profileData);
      await updateUserProfile({
        bio,
        interests,
        photos: photos.filter(Boolean),
        profileScore: analysis?.score || 0,
      });
      Alert.alert('Success', 'Profile saved!');
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Could not save profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.center}>
        <ActivityIndicator size="large" color={colors.primary} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.title}>Profile Builder</Text>
        <Text style={styles.subtitle}>Fill in the details to get your profile score.</Text>

        <Card>
          <Text style={styles.label}>About Me / Bio</Text>
          <TextInput
            style={styles.bioInput}
            multiline
            numberOfLines={4}
            value={bio}
            onChangeText={setBio}
            placeholder="Write a short, fun bio..."
            maxLength={500}
          />
          <Text style={styles.counter}>{bio.length}/500</Text>
        </Card>

        <Card>
          <Text style={styles.label}>Interests ({interests.length} selected)</Text>
          <View style={styles.interestsGrid}>
            {INTERESTS.map((interest) => (
              <TouchableOpacity
                key={interest}
                onPress={() => toggleInterest(interest)}
                style={[
                  styles.interestChip,
                  interests.includes(interest) && styles.interestChipSelected,
                ]}
              >
                <Text
                  style={[
                    styles.interestText,
                    interests.includes(interest) && styles.interestTextSelected,
                  ]}
                >
                  {interest}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </Card>

        <Card>
          <Text style={styles.label}>Photos (URLs for demo)</Text>
          {photos.map((photo, index) => (
            <TextInput
              key={index}
              style={styles.photoInput}
              value={photo}
              onChangeText={(text) => updatePhoto(index, text)}
              placeholder={`Photo ${index + 1} URL`}
            />
          ))}
        </Card>

        <Button title="Analyze Profile" onPress={handleAnalyze} variant="secondary" style={styles.button} />

        {analysis && (
          <Card style={styles.analysisCard}>
            <Text style={styles.scoreLabel}>Profile Score</Text>
            <View style={styles.scoreBar}>
              <View style={[styles.scoreFill, { width: `${analysis.score}%` }]} />
            </View>
            <Text style={styles.scoreText}>{analysis.score}/100</Text>
            <Text style={styles.feedbackTitle}>AI Feedback</Text>
            {analysis.feedback.map((item, index) => (
              <Text key={index} style={styles.feedbackItem}>• {item}</Text>
            ))}
          </Card>
        )}

        <Button title="Save Profile" onPress={handleSave} loading={saving} style={styles.button} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
  label: {
    fontSize: fontSize.md,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.sm,
  },
  bioInput: {
    backgroundColor: colors.background,
    borderRadius: radius.md,
    padding: spacing.md,
    fontSize: fontSize.md,
    minHeight: 100,
    textAlignVertical: 'top',
  },
  counter: {
    textAlign: 'right',
    fontSize: fontSize.xs,
    color: colors.textLight,
    marginTop: spacing.xs,
  },
  interestsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  interestChip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.full,
    backgroundColor: colors.background,
    margin: spacing.xs,
    borderWidth: 1,
    borderColor: colors.border,
  },
  interestChipSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  interestText: {
    color: colors.text,
    fontSize: fontSize.sm,
  },
  interestTextSelected: {
    color: '#fff',
  },
  photoInput: {
    backgroundColor: colors.background,
    borderRadius: radius.md,
    padding: spacing.md,
    fontSize: fontSize.md,
    marginBottom: spacing.sm,
  },
  button: {
    marginTop: spacing.md,
  },
  analysisCard: {
    backgroundColor: colors.surface,
  },
  scoreLabel: {
    fontSize: fontSize.md,
    fontWeight: '600',
    color: colors.text,
  },
  scoreBar: {
    height: 12,
    backgroundColor: colors.border,
    borderRadius: radius.full,
    marginVertical: spacing.sm,
    overflow: 'hidden',
  },
  scoreFill: {
    height: '100%',
    backgroundColor: colors.success,
    borderRadius: radius.full,
  },
  scoreText: {
    fontSize: fontSize.lg,
    fontWeight: 'bold',
    color: colors.success,
    marginBottom: spacing.md,
  },
  feedbackTitle: {
    fontSize: fontSize.md,
    fontWeight: '600',
    color: colors.text,
    marginTop: spacing.md,
    marginBottom: spacing.sm,
  },
  feedbackItem: {
    fontSize: fontSize.sm,
    color: colors.textLight,
    marginBottom: spacing.xs,
  },
});
