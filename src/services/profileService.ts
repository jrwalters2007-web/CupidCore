import { db } from '../config/firebase';
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { UserProfile, DatingProfile, BioTemplate, PhotoTip } from '../types';

export async function saveProfile(userId: string, profile: Partial<UserProfile>) {
  const docRef = doc(db, 'users', userId);
  await updateDoc(docRef, {
    ...profile,
    updatedAt: new Date(),
  });
}

export async function saveDatingProfile(userId: string, datingProfile: DatingProfile) {
  const docRef = doc(db, 'datingProfiles', userId);
  await setDoc(docRef, {
    ...datingProfile,
    updatedAt: new Date(),
  });
}

export async function getDatingProfile(userId: string): Promise<DatingProfile | null> {
  const docRef = doc(db, 'datingProfiles', userId);
  const snap = await getDoc(docRef);
  if (snap.exists()) {
    return snap.data() as DatingProfile;
  }
  return null;
}

export const BIO_TEMPLATES: BioTemplate[] = [
  { id: '1', title: 'Weekend Explorer', category: 'Adventure', content: 'Weekend plans usually involve hiking trails, coffee shops, or spontaneous road trips. Looking for someone who appreciates good views and better conversations.', premium: false },
  { id: '2', title: 'Foodie First', category: 'Food', content: 'Professional eater and amateur chef. I judge cities by their taco scene and make a mean Sunday brunch. Let\'s find the best hidden gem together.', premium: false },
  { id: '3', title: 'Creative Soul', category: 'Creative', content: 'I create things during the week and collect experiences on the weekends. Always curious, usually laughing, and looking for a partner in crime.', premium: true },
  { id: '4', title: 'Dog Parent', category: 'Lifestyle', content: 'My dog approves of you already (probably). I\'m a morning person, a coffee person, and a firm believer that the best dates are walks with good conversation.', premium: true },
  { id: '5', title: 'Ambitious & Playful', category: 'Career', content: 'By day I\'m building my career, by night I\'m trying new restaurants or rewatching comfort shows. Seeking someone ambitious, kind, and down to laugh.', premium: true },
  { id: '6', title: 'Witty & Warm', category: 'Humor', content: 'I\'ll make you laugh, remember your coffee order, and pretend I know about wine. Looking for someone who doesn\'t take life too seriously.', premium: true },
];

export const PHOTO_TIPS: PhotoTip[] = [
  { id: '1', title: 'The Smile Shot', description: 'A genuine, warm smile is the #1 thing people notice. Use a clear, well-lit headshot as your first photo.', category: 'Basics', premium: false },
  { id: '2', title: 'Hobby in Action', description: 'Show yourself doing something you love. Action photos tell a story and start conversations.', category: 'Engagement', premium: false },
  { id: '3', title: 'Social Proof', description: 'One group photo can show you have friends, but make sure you\'re easy to identify.', category: 'Social', premium: false },
  { id: '4', title: 'Outfit Variety', description: 'Mix casual and dressed-up looks to show different sides of your personality.', category: 'Style', premium: true },
  { id: '5', title: 'Candid Beats Perfect', description: 'Natural, candid photos often perform better than overly posed professional shots.', category: 'Authenticity', premium: true },
  { id: '6', title: 'Photo Order Matters', description: 'Headshot first, hobby second, social third, and save something intriguing for the end.', category: 'Strategy', premium: true },
];
