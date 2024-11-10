import { Settings, Trade } from '@/utils/types';
import { calculateTradeResults } from './TradeCalculator';

interface TradeHistoryProps {
  trades: Trade[];
  settings: Settings;
}

export const TradeHistory = ({ trades, settings }: TradeHistoryProps) => {
  const renderTradeDetails = (trade: Trade) => {
    const results = calculateTradeResults(
      Number(trade.entryPrice),
      Number(trade.exitPrice),
      Number(trade.positionUSD),
      trade.isLong,
      settings
    );

    if (!results) return null;

    return (
      <div className="flex flex-col gap-1">
        <div className={`font-bold text-base sm:text-lg ${results.pnlUSD >= 0 ? 'text-[#00C805]' : 'text-[#FF3B30]'}`}>
          {results.pnlPercentage}% (${results.pnlUSD.toFixed(2)})
        </div>
        <div className="text-xs sm:text-sm text-gray-400">
          Fees: ${results.totalFees} | Margin: ${results.requiredMargin}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-2 sm:space-y-3">
      {trades.map((trade) => (
        <div
          key={trade.id}
          className="bg-[#1E1E1E] p-3 sm:p-4 rounded-lg flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-0"
        >
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <span className={`font-bold text-base sm:text-lg ${trade.isLong ? 'text-[#00C805]' : 'text-[#FF3B30]'}`}>
              {trade.isLong ? 'LONG' : 'SHORT'}
            </span>
            <span className="text-gray-400 text-sm sm:text-base">
              ${Number(trade.positionUSD).toLocaleString()}
            </span>
            <span className="text-gray-400 text-sm sm:text-base font-mono">
              {Number(trade.entryPrice).toLocaleString()} → {Number(trade.exitPrice).toLocaleString()}
            </span>
          </div>
          {renderTradeDetails(trade)}
        </div>
      ))}
    </div>
  );
};