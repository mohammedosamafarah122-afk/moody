// Standardized mood emojis and labels for consistent display across the app
export const MOOD_EMOJIS = {
  1: '😢', // Very Sad
  2: '😔', // Sad  
  3: '😐', // Neutral
  4: '😊', // Happy
  5: '😄'  // Very Happy
} as const;

export const MOOD_LABELS = {
  1: 'Very Sad',
  2: 'Sad',
  3: 'Neutral', 
  4: 'Happy',
  5: 'Very Happy'
} as const;

export const MOOD_COLORS = {
  1: 'red-500',
  2: 'orange-500', 
  3: 'yellow-500',
  4: 'green-500',
  5: 'blue-500'
} as const;

// Helper function to get emoji by score
export const getMoodEmoji = (score: number): string => {
  return MOOD_EMOJIS[score as keyof typeof MOOD_EMOJIS] || '😐';
};

// Helper function to get label by score
export const getMoodLabel = (score: number): string => {
  return MOOD_LABELS[score as keyof typeof MOOD_LABELS] || 'Unknown';
};

// Helper function to get color by score
export const getMoodColor = (score: number): string => {
  return MOOD_COLORS[score as keyof typeof MOOD_COLORS] || 'gray-500';
};
