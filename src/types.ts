export type TopicId = 'words' | 'healthy' | 'favourite' | 'lunch';

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: string;
  topic?: TopicId;
}

export interface FoodItem {
  id: string;
  name: string;
  category: 'fruits' | 'vegetables' | 'grains' | 'protein' | 'drinks';
  emoji: string;
  simpleMeaning: string;
  healthyBenefit: string;
  exampleSentence: string;
}

export interface LunchTrayState {
  grains: string | null;
  protein: string | null;
  veggie: string | null;
  fruit: string | null;
  drink: string | null;
}
