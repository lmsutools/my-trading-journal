'use client';
import { Input } from '../UI/Input';
import { TradeFormData } from './types';
import { useEffect, useRef } from 'react';

interface TradeFormProps {
  trade: TradeFormData;
  onTradeChange: (trade: TradeFormData) => void;
  onSubmitLong: () => void;
  onSubmitShort: () => void;
  balance: number;
}

export const TradeForm = ({ trade, onTradeChange, onSubmitLong, onSubmitShort, balance }: TradeFormProps) => {
  const lastValues = useRef({
    entryPrice: '',
    exitPrice: ''
  });

  useEffect(() => {
    // When a trade is submitted (inputs become empty), pre-fill with last values
    if (!trade.entryPrice && !trade.exitPrice) {
      const savedTrades = localStorage.getItem('tradeHistory');
      if (savedTrades) {
        const trades = JSON.parse(savedTrades);
        if (trades.length > 0) {
          const lastTrade = trades[0];
          lastValues.current = {
            entryPrice: String(lastTrade.entryPrice).slice(0, 2),
            exitPrice: String(lastTrade.exitPrice).slice(0, 2)
          };
          
          // Pre-fill with last values
          onTradeChange({
            ...trade,
            entryPrice: lastValues.current.entryPrice,
            exitPrice: lastValues.current.exitPrice
          });
        }
      }
    }
  }, [trade.entryPrice, trade.exitPrice]);

  return (
    <div className="bg-[#1E1E1E] p-4 sm:p-6 lg:p-8 rounded-xl space-y-4 sm:space-y-6">
      <div className="text-xl sm:text-2xl font-bold mb-2 sm:mb-4 text-white">
        Balance: ${balance.toFixed(2)}
      </div>

      <Input
        label="Entry Price"
        value={trade.entryPrice}
        onChange={(e) => onTradeChange({ ...trade, entryPrice: e.target.value })}
        placeholder="Enter price"
        className="text-base sm:text-lg"
      />

      <Input
        label="Exit Price"
        value={trade.exitPrice}
        onChange={(e) => onTradeChange({ ...trade, exitPrice: e.target.value })}
        placeholder="Exit price"
        className="text-base sm:text-lg"
      />

      <Input
        label="Position Size (USD)"
        value={trade.positionUSD}
        onChange={(e) => onTradeChange({ ...trade, positionUSD: e.target.value })}
        placeholder="Position size"
        className="text-base sm:text-lg"
      />

      <div className="flex gap-3 sm:gap-4 pt-1 sm:pt-2">
        <button
          onClick={onSubmitLong}
          className="flex-1 py-3 sm:py-4 text-base sm:text-lg bg-green-600 hover:bg-green-700 text-white rounded-lg font-bold transition-colors"
        >
          LONG
        </button>
        <button
          onClick={onSubmitShort}
          className="flex-1 py-3 sm:py-4 text-base sm:text-lg bg-red-600 hover:bg-red-700 text-white rounded-lg font-bold transition-colors"
        >
          SHORT
        </button>
      </div>
    </div>
  );
};