import { Trade } from './types';

export interface PerformanceMetrics {
  grossProfit: number;
  netProfit: number;
  maxRunUp: number;
  maxDrawdown: number;
  commissionPaid: number;
  totalTrades: number;
  winningTrades: number;
  losingTrades: number;
  percentProfitable: number;
  currentStreak: {
    count: number;
    type: 'win' | 'loss' | 'none';
  };
  maxWinStreak: number;
  maxLossStreak: number;
  avgTrade: number;
  avgWinningTrade: number;
  avgLosingTrade: number;
  ratioAvgWinLoss: number;
  largestWinningTrade: {
    amount: number;
    percentage: number;
  };
  largestLosingTrade: {
    amount: number;
    percentage: number;
  };
}

export const calculatePerformanceMetrics = (trades: Trade[], initialBalance: number): PerformanceMetrics => {
  const initialMetrics: PerformanceMetrics = {
    grossProfit: 0,
    netProfit: 0,
    maxRunUp: 0,
    maxDrawdown: 0,
    commissionPaid: 0,
    totalTrades: trades.length,
    winningTrades: 0,
    losingTrades: 0,
    percentProfitable: 0,
    currentStreak: { count: 0, type: 'none' },
    maxWinStreak: 0,
    maxLossStreak: 0,
    avgTrade: 0,
    avgWinningTrade: 0,
    avgLosingTrade: 0,
    ratioAvgWinLoss: 0,
    largestWinningTrade: { amount: 0, percentage: 0 },
    largestLosingTrade: { amount: 0, percentage: 0 },
  };

  if (trades.length === 0) return initialMetrics;

  let currentBalance = initialBalance;
  let currentDrawdown = 0;
  let peakBalance = initialBalance;
  let currentWinStreak = 0;
  let currentLossStreak = 0;
  let grossLoss = 0;
  const finalMetrics = { ...initialMetrics };

  trades.forEach((trade) => {
    const pnl = trade.pnlUSD || 0;
    const pnlPercentage = trade.pnlPercentage || 0;
    currentBalance += pnl;

    if (pnl > 0) {
      finalMetrics.grossProfit += pnl;
      finalMetrics.winningTrades++;
      currentWinStreak++;
      currentLossStreak = 0;
      finalMetrics.maxWinStreak = Math.max(finalMetrics.maxWinStreak, currentWinStreak);

      // Track largest winning trade
      if (pnl > finalMetrics.largestWinningTrade.amount) {
        finalMetrics.largestWinningTrade = { amount: pnl, percentage: pnlPercentage };
      }
    } else if (pnl < 0) {
      grossLoss += Math.abs(pnl);
      finalMetrics.losingTrades++;
      currentLossStreak++;
      currentWinStreak = 0;
      finalMetrics.maxLossStreak = Math.max(finalMetrics.maxLossStreak, currentLossStreak);

      // Track largest losing trade
      if (Math.abs(pnl) > Math.abs(finalMetrics.largestLosingTrade.amount)) {
        finalMetrics.largestLosingTrade = { amount: pnl, percentage: pnlPercentage };
      }
    }

    if (currentBalance > peakBalance) {
      peakBalance = currentBalance;
      finalMetrics.maxRunUp = Math.max(finalMetrics.maxRunUp, peakBalance - initialBalance);
      currentDrawdown = 0;
    } else {
      currentDrawdown = peakBalance - currentBalance;
      finalMetrics.maxDrawdown = Math.max(finalMetrics.maxDrawdown, currentDrawdown);
    }
  });

  // Calculate averages and ratios
  finalMetrics.avgTrade = finalMetrics.netProfit / finalMetrics.totalTrades;
  
  if (finalMetrics.winningTrades > 0) {
    finalMetrics.avgWinningTrade = finalMetrics.grossProfit / finalMetrics.winningTrades;
  }
  
  if (finalMetrics.losingTrades > 0) {
    finalMetrics.avgLosingTrade = grossLoss / finalMetrics.losingTrades;
  }
  
  if (finalMetrics.avgLosingTrade !== 0) {
    finalMetrics.ratioAvgWinLoss = Math.abs(finalMetrics.avgWinningTrade / finalMetrics.avgLosingTrade);
  }

  if (currentWinStreak > 0) {
    finalMetrics.currentStreak = { count: currentWinStreak, type: 'win' };
  } else if (currentLossStreak > 0) {
    finalMetrics.currentStreak = { count: currentLossStreak, type: 'loss' };
  }

  finalMetrics.netProfit = currentBalance - initialBalance;
  finalMetrics.percentProfitable = (finalMetrics.winningTrades / finalMetrics.totalTrades) * 100;
  finalMetrics.commissionPaid = trades.reduce((total, trade) => 
    total + (Number(trade.positionUSD) * 0.0004), 0);

  return finalMetrics;
};