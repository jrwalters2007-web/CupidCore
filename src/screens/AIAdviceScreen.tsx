import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { usePremium } from '../hooks/usePremium';
import { useAuth } from '../context/AuthContext';
import { getChatAdvice, generateBioSuggestions, getFirstMessageTips } from '../services/aiAdvice';
import { AdviceMessage } from '../types';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { showInterstitialAd } from '../services/monetization';
import { colors, spacing, fontSize, radius } from '../theme/colors';

const SUGGESTIONS = [
  'How can I improve my bio?',
  'What photos should I use?',
  'Help me write a first message',
  'Tips for a great first date',
];

export default function AIAdviceScreen() {
  const { isPremium, canAccessPremium } = usePremium();
  const { profile } = useAuth();
  const [messages, setMessages] = useState<AdviceMessage[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Hi! I\'m your dating coach. Ask me anything about your profile, photos, or messages.',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [bioAnswers, setBioAnswers] = useState({
    hobby: '',
    job: '',
    weekend: '',
    idealDate: '',
    funFact: '',
  });
  const [generatedBios, setGeneratedBios] = useState<string[]>([]);
  const scrollViewRef = useRef<ScrollView>(null);

  const sendMessage = async (text: string) => {
    if (!isPremium) {
      Alert.alert('Premium Feature', 'AI chat is available with Premium. Upgrade now?');
      return;
    }
    if (!text.trim()) return;

    const userMessage: AdviceMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      timestamp: new Date(),
    };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput('');
    setLoading(true);

    if (!isPremium) {
      await showInterstitialAd();
    }

    const response = await getChatAdvice(updatedMessages);
    const assistantMessage: AdviceMessage = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: response,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, assistantMessage]);
    setLoading(false);
    setTimeout(() => scrollViewRef.current?.scrollToEnd({ animated: true }), 100);
  };

  const generateBios = () => {
    if (!isPremium) {
      Alert.alert('Premium Feature', 'Bio generation is available with Premium.');
      return;
    }
    const bios = generateBioSuggestions(bioAnswers);
    setGeneratedBios(bios);
  };

  const copyBio = (bio: string) => {
    setInput(bio);
  };

  if (!isPremium) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.locked}>
          <Text style={styles.lockEmoji}>🔒</Text>
          <Text style={styles.lockTitle}>AI Dating Coach</Text>
          <Text style={styles.lockText}>
            Upgrade to Premium to unlock personalized AI advice, bio generation, and first-message tips.
          </Text>
          <Button title="Upgrade to Premium" variant="premium" onPress={() => {}} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          ref={scrollViewRef}
          contentContainerStyle={styles.scroll}
          onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
        >
          <Text style={styles.title}>AI Dating Coach</Text>

          <Card>
            <Text style={styles.sectionTitle}>Quick Bio Generator</Text>
            <TextInput
              style={styles.smallInput}
              placeholder="Hobby (e.g., hiking)"
              value={bioAnswers.hobby}
              onChangeText={(text) => setBioAnswers({ ...bioAnswers, hobby: text })}
            />
            <TextInput
              style={styles.smallInput}
              placeholder="Job / role"
              value={bioAnswers.job}
              onChangeText={(text) => setBioAnswers({ ...bioAnswers, job: text })}
            />
            <TextInput
              style={styles.smallInput}
              placeholder="Weekend activity"
              value={bioAnswers.weekend}
              onChangeText={(text) => setBioAnswers({ ...bioAnswers, weekend: text })}
            />
            <TextInput
              style={styles.smallInput}
              placeholder="Ideal date"
              value={bioAnswers.idealDate}
              onChangeText={(text) => setBioAnswers({ ...bioAnswers, idealDate: text })}
            />
            <TextInput
              style={styles.smallInput}
              placeholder="Fun fact"
              value={bioAnswers.funFact}
              onChangeText={(text) => setBioAnswers({ ...bioAnswers, funFact: text })}
            />
            <Button title="Generate Bio Ideas" onPress={generateBios} variant="secondary" />
            {generatedBios.map((bio, index) => (
              <TouchableOpacity key={index} onPress={() => copyBio(bio)}>
                <Text style={styles.generatedBio}>{bio}</Text>
              </TouchableOpacity>
            ))}
          </Card>

          <Card>
            <Text style={styles.sectionTitle}>First Message Tips</Text>
            {getFirstMessageTips(profile || {}).map((tip, index) => (
              <Text key={index} style={styles.tip}>• {tip}</Text>
            ))}
          </Card>

          <View style={styles.chatContainer}>
            {messages.map((message) => (
              <View
                key={message.id}
                style={[
                  styles.message,
                  message.role === 'user' ? styles.userMessage : styles.assistantMessage,
                ]}
              >
                <Text style={message.role === 'user' ? styles.userText : styles.assistantText}>
                  {message.content}
                </Text>
              </View>
            ))}
            {loading && <ActivityIndicator color={colors.primary} style={styles.loader} />}
          </View>

          <View style={styles.suggestions}>
            {SUGGESTIONS.map((suggestion) => (
              <TouchableOpacity
                key={suggestion}
                onPress={() => sendMessage(suggestion)}
                style={styles.suggestionChip}
              >
                <Text style={styles.suggestionText}>{suggestion}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={input}
            onChangeText={setInput}
            placeholder="Ask your dating coach..."
            multiline
          />
          <TouchableOpacity onPress={() => sendMessage(input)} style={styles.sendButton}>
            <Text style={styles.sendText}>Send</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
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
    paddingBottom: spacing.xl,
  },
  title: {
    fontSize: fontSize.xl,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: spacing.md,
  },
  sectionTitle: {
    fontSize: fontSize.md,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.sm,
  },
  smallInput: {
    backgroundColor: colors.background,
    borderRadius: radius.md,
    padding: spacing.md,
    fontSize: fontSize.md,
    marginBottom: spacing.sm,
  },
  generatedBio: {
    backgroundColor: colors.background,
    borderRadius: radius.md,
    padding: spacing.md,
    marginTop: spacing.sm,
    fontSize: fontSize.sm,
    color: colors.text,
  },
  tip: {
    fontSize: fontSize.sm,
    color: colors.textLight,
    marginBottom: spacing.xs,
  },
  chatContainer: {
    marginTop: spacing.md,
  },
  message: {
    padding: spacing.md,
    borderRadius: radius.lg,
    marginBottom: spacing.sm,
    maxWidth: '80%',
  },
  userMessage: {
    backgroundColor: colors.primary,
    alignSelf: 'flex-end',
  },
  assistantMessage: {
    backgroundColor: colors.surface,
    alignSelf: 'flex-start',
  },
  userText: {
    color: '#fff',
    fontSize: fontSize.md,
  },
  assistantText: {
    color: colors.text,
    fontSize: fontSize.md,
  },
  loader: {
    marginVertical: spacing.sm,
  },
  suggestions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: spacing.sm,
  },
  suggestionChip: {
    backgroundColor: colors.surface,
    borderRadius: radius.full,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    margin: spacing.xs,
    borderWidth: 1,
    borderColor: colors.border,
  },
  suggestionText: {
    color: colors.primary,
    fontSize: fontSize.sm,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: spacing.md,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  input: {
    flex: 1,
    backgroundColor: colors.background,
    borderRadius: radius.md,
    padding: spacing.md,
    fontSize: fontSize.md,
    maxHeight: 100,
  },
  sendButton: {
    backgroundColor: colors.primary,
    borderRadius: radius.md,
    paddingHorizontal: spacing.lg,
    justifyContent: 'center',
    marginLeft: spacing.sm,
  },
  sendText: {
    color: '#fff',
    fontWeight: '600',
  },
  locked: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
  },
  lockEmoji: {
    fontSize: 64,
    marginBottom: spacing.md,
  },
  lockTitle: {
    fontSize: fontSize.xl,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: spacing.sm,
  },
  lockText: {
    fontSize: fontSize.md,
    color: colors.textLight,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
});
