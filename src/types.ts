export type AppMode = 'home' | 'chat' | 'ugc' | 'wiki';

export interface Message {
  role: 'user' | 'shangshang' | 'caicai' | 'system';
  content: string;
}

export interface PolicyItem {
  title: string;
  content: string;
}
