
export interface TradeLog {
  id: string;
  timestamp: number;
  amount: number;
  type: 'profit' | 'loss';
  message: string;
}

export interface TradingStats {
  balance: number;
  profit: number;
  trades: number;
  history: TradeLog[];
}

export interface TradingSettings {
  riskLevel: 'conservative' | 'balanced' | 'aggressive';
  maxTradeSize: number;
  notifications: {
    tradeExecutions: boolean;
    dailySummary: boolean;
    marketNews: boolean;
  };
}

export interface Transaction {
  id: string;
  userId: string;
  type: 'deposit' | 'withdrawal' | 'adjustment' | 'profit' | 'loss';
  amount: number;
  fee?: number;
  net?: number;
  status: 'completed' | 'pending' | 'failed' | 'declined';
  date: string;
  note?: string;
  destination?: string;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  time: string;
  type: 'success' | 'info' | 'warning' | 'system';
  read: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phoneNumber?: string;
  country?: string;
  balance: number;
  status: 'active' | 'suspended';
  kyc: 'verified' | 'pending';
  linkedAccounts: number;
  joinDate: string;
  lastLogin?: string;
  sessionDuration?: string;
  activeBots?: number;
  autoTrading?: boolean;
  notifications?: AppNotification[];
}