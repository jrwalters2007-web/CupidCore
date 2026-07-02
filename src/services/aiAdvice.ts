import { DatingProfile, AdviceMessage } from '../types';

const ADVICE_PROMPTS = {
  bio: [
    'Lead with a fun fact or unique hobby.',
    'Use specifics instead of generic phrases like "I love to travel."',
    'Add a lighthearted prompt that invites conversation.',
    'Avoid negativity or lists of what you DON\'T want.',
  ],
  photos: [
    'Use a clear, smiling headshot as your first photo.',
    'Include at least one photo showing a hobby or activity.',
    'Avoid group photos where it\'s hard to identify you.',
    'Make sure your photos are well-lit and high resolution.',
  ],
  interests: [
    'Pick interests that you can actually talk about.',
    'Mix popular interests with a few unique ones.',
    'Use interests to hint at date ideas.',
  ],
  redFlags: [
    'Too many shirtless selfies can signal vanity.',
    'All group photos make your profile feel like a puzzle.',
    'Overly negative bios push people away.',
    'Listing demands instead of interests limits matches.',
  ],
};

export function analyzeProfile(profile: Partial<DatingProfile>) {
  const score = Math.min(100, Math.max(30,
    (profile.bio ? 25 : 0) +
    (profile.photos?.length ? Math.min(25, profile.photos.length * 5) : 0) +
    (profile.interests?.length ? Math.min(20, profile.interests.length * 4) : 0) +
    (profile.bio && profile.bio.length > 80 ? 10 : 0) +
    (profile.bio && profile.bio.length > 150 ? 10 : 0) +
    (profile.photos && profile.photos.length >= 3 ? 10 : 0)
  ));

  const feedback: string[] = [];
  if (!profile.bio || profile.bio.length < 50) {
    feedback.push('Your bio is too short. Aim for 2-3 sentences that show personality.');
  }
  if (!profile.photos || profile.photos.length < 3) {
    feedback.push('Add more photos. Profiles with 3-6 photos get more matches.');
  }
  if (!profile.interests || profile.interests.length < 3) {
    feedback.push('Add more interests to make conversation starters easier.');
  }
  if (profile.bio && profile.bio.toLowerCase().includes('i love to travel')) {
    feedback.push('"I love to travel" is overused. Try a specific travel memory or dream destination.');
  }
  if (feedback.length === 0) {
    feedback.push('Your profile is looking great! Consider adding one more candid photo to stand out.');
  }

  return {
    score,
    feedback,
    tips: {
      bio: ADVICE_PROMPTS.bio,
      photos: ADVICE_PROMPTS.photos,
      interests: ADVICE_PROMPTS.interests,
      redFlags: ADVICE_PROMPTS.redFlags,
    },
  };
}

export function generateBioSuggestions(answers: {
  hobby?: string;
  job?: string;
  weekend?: string;
  idealDate?: string;
  funFact?: string;
}): string[] {
  const bios: string[] = [];
  if (answers.hobby && answers.funFact) {
    bios.push(`When I'm not ${answers.hobby}, you can find me ${answers.funFact}. Currently accepting ${answers.idealDate || 'coffee'} date applications.`);
  }
  if (answers.job && answers.weekend) {
    bios.push(`By day I'm ${answers.job}, but weekends are for ${answers.weekend}. Let's swap favorite ${answers.hobby || 'hobbies'}.`);
  }
  if (answers.idealDate && answers.funFact) {
    bios.push(`My ideal date: ${answers.idealDate}. Random fact: ${answers.funFact}. Tell me yours?`);
  }
  if (bios.length === 0) {
    bios.push('Tell us a bit more about yourself to generate personalized bios.');
  }
  return bios;
}

export async function getChatAdvice(messages: AdviceMessage[]): Promise<string> {
  const lastUserMessage = messages
    .slice()
    .reverse()
    .find((m) => m.role === 'user')?.content || '';
  const lower = lastUserMessage.toLowerCase();

  if (lower.includes('bio') || lower.includes('about me')) {
    return 'A great bio is specific, positive, and conversation-friendly. Try leading with a fun fact or a quirky hobby.';
  }
  if (lower.includes('photo') || lower.includes('picture')) {
    return 'Use a clear headshot first, then show hobbies, social life, and one candid photo. Aim for 4-6 high-quality images.';
  }
  if (lower.includes('message') || lower.includes('text') || lower.includes('open')) {
    return 'Openers that reference a specific detail from their profile get 3x more replies. Avoid generic "hey" messages.';
  }
  if (lower.includes('date') || lower.includes('first date')) {
    return 'Low-pressure first dates work best: coffee, a walk, or a casual activity. Keep it short and leave room for a second date.';
  }
  if (lower.includes('premium') || lower.includes('pay')) {
    return 'Premium unlocks AI profile analysis, bio templates, photo tips, and an ad-free experience. Check out the Premium tab!';
  }

  return 'Keep your profile authentic, positive, and specific. The best matches come from showing who you really are.';
}

export function getFirstMessageTips(profile: Partial<DatingProfile>): string[] {
  return [
    `Comment on their ${profile.interests?.[0] ? `"${profile.interests[0]}"` : 'interest'} with a genuine question.`,
    'Compliment something specific, not just their looks.',
    'Ask an open-ended question that requires more than yes/no.',
    'Match their energy level in the first message.',
  ];
}
