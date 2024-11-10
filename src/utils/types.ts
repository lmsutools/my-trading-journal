export interface Settings {
  leverage: number;
  exchangeFee: number;
  initialBalance: number;
}

export interface Trade {
  id: string;
  entryPrice: string;
  exitPrice: string;
  positionUSD: string;
  isLong: boolean;
  leverage: number;
  pnlPercentage?: number;
  pnlUSD?: number;
  timestamp: number;
}