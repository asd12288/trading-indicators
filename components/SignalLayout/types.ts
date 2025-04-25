import { ReactNode } from "react";
import { EconomicEvent } from "../../services/finnhub";

// Tab type definition
export interface Tab {
  id: string;
  label: string;
  icon: ReactNode;
  isPremium?: boolean;
}

// Props for SignalLayout components
export interface SignalLayoutProps {
  id: string;
  userId: string;
  isPro: boolean;
}

// Props for tab content components
export interface TabContentProps {
  theme: string;
  instrumentName: string;
  instrumentData: any[];
  tradeId?: string | null;
  isPro: boolean;
  handleUpgradeClick: () => void;
  lastSignal: any;
}

// Props for the news tab
export interface NewsTabProps extends TabContentProps {
  economicEvents: EconomicEvent[];
  isCalendarLoading: boolean;
  loadCalendarData: () => void;
}
