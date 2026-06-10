export interface Feature {
  id: string;
  title: string;
  description: string;
  category: 'focus' | 'mind' | 'body' | 'tracking';
  icon: string; // Lucide icon name or dynamic matcher
  benefits: string;
  interactiveDemo?: string;
}

export interface AchievementLevel {
  level: string;
  title: string;
  description: string;
  requirement: string;
  badgeColor: string;
  iconName: string;
}

export interface MoodItem {
  id: string;
  name: string;
  emoji: string;
  color: string;
  bgClass: string;
  textClass: string;
  recommendations: {
    activity: string;
    duration: string;
    description: string;
    soundSuggested: string;
  }[];
}

export interface Benefit {
  title: string;
  description: string;
  metric?: string;
  color: string;
}
