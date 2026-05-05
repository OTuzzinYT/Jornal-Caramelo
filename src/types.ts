export interface User {
  username: string;
  email: string;
  joinedAt: string;
  isAdmin?: boolean;
}

export enum Category {
  POLITICA = "Política",
  TECNOLOGIA = "Tecnologia",
  MUNDO = "Mundo",
  BRASIL = "Brasil",
  ESPORTES = "Esportes",
  ENTRETENIMENTO = "Entretenimento"
}

export interface NewsItem {
  id: string;
  title: string;
  summary: string;
  fullContent: string;
  category: Category;
  imageUrl: string;
  timestamp: string;
  updatedAt?: string;
  isBreaking?: boolean;
  isRecent?: boolean;
  popularity: number; // 0-100
}

export interface TrendingTopic {
  id: string;
  topic: string;
  count: string;
}

export interface Comment {
  id: string;
  author: string;
  text: string;
  timestamp: string;
}
