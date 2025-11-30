export interface Bid {
  id: string;
  title: string;
  agency: string;
  value: number;
  deadline: string; // ISO date
  status: 'open' | 'review' | 'submitted' | 'closed';
  description: string;
  requirements: string[];
  category: string;
}

export interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}

export enum ViewState {
  DASHBOARD = 'DASHBOARD',
  BID_DETAIL = 'BID_DETAIL',
  AI_CHAT = 'AI_CHAT'
}
