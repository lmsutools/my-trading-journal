// src/components/TradeEntry/TradeCalculator.tsx

import { Settings } from '@/utils/types';

export const calculateTradeResults = (
  entryPrice: number,
  exitPrice: number,
  positionUSD: number,
  isLong: boolean,
  settings: Settings
) => {
  if (!entryPrice || !exitPrice || !positionUSD) return null;

  // Example calculation breakdown:
  // If position = $1000, leverage = 20x, entry = $40000, exit = $42000, fee = 0.04%
  
  // 1. Calculate actual position size with leverage
  const leveragedPosition = positionUSD * settings.leverage;  // $1000 * 20 = $20000
  
  // 2. Calculate required margin
  const requiredMargin = positionUSD;  // $1000 (original position without leverage)
  
  // 3. Calculate entry fee
  const entryFee = (leveragedPosition * settings.exchangeFee) / 100;  // $20000 * 0.04% = $8
  
  // 4. Calculate exit fee
  const exitFee = (leveragedPosition * settings.exchangeFee) / 100;  // $20000 * 0.04% = $8
  
  // 5. Calculate raw PnL
  const priceChange = isLong ? 
    ((exitPrice - entryPrice) / entryPrice) : // Long: ($42000 - $40000) / $40000 = 0.05 = 5%
    ((entryPrice - exitPrice) / entryPrice);  // Short calculation
    
  const rawPnlPercentage = priceChange * 100 * settings.leverage; // 5% * 20 = 100%
  const rawPnlUSD = (positionUSD * rawPnlPercentage) / 100;      // $1000 * 100% = $1000
  
  // 6. Calculate net PnL after fees
  const totalFees = entryFee + exitFee;  // $8 + $8 = $16
  const netPnlUSD = rawPnlUSD - totalFees;  // $1000 - $16 = $984
  const netPnlPercentage = (netPnlUSD / positionUSD) * 100;  // ($984 / $1000) * 100 = 98.4%

  return {
    pnlPercentage: Number(netPnlPercentage.toFixed(2)),
    pnlUSD: Number(netPnlUSD.toFixed(2)),
    positionBTC: Number((leveragedPosition / entryPrice).toFixed(8)),
    requiredMargin: Number(requiredMargin.toFixed(2)),
    totalFees: Number(totalFees.toFixed(2)),
    leveragedPosition: Number(leveragedPosition.toFixed(2))
  };
};