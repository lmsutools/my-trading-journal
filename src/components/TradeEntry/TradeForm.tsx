'use client';
import { Input } from '../UI/Input';
import { TradeFormData } from './types';
import { useEffect, useState } from 'react';

interface TradeFormProps {
  trade: TradeFormData;
  onTradeChange: (trade: TradeFormData) => void;
  onSubmitLong: () => void;
  onSubmitShort: () => void;
  balance: number;
}

export const TradeForm = ({ trade, onTradeChange, onSubmitLong, onSubmitShort, balance }: TradeFormProps) => {
  const [lastEntryDigits, setLastEntryDigits] = useState('');
  const [lastExitDigits, setLastExitDigits] = useState('');

  useEffect(() => {
    const savedTrades = localStorage.getItem('tradeHistory');
    if (savedTrades) {
      const trades = JSON.parse(savedTrades);
      if (trades.length > 0) {
        const lastTrade = trades[0];
        setLastEntryDigits(lastTrade.entryPrice.toString().slice(0, 2));
        setLastExitDigits(lastTrade.exitPrice.toString().slice(0, 2));
      }
    }
  }, []);

  const handleNewTrade = (type: 'entry' | 'exit', value: string) => {
    if (type === 'entry') {
      if (value === '') {
        onTradeChange({ ...trade, entryPrice: lastEntryDigits });
      } else {
        onTradeChange({ ...trade, entryPrice: value });
      }
    } else {
      if (value === '') {
        onTradeChange({ ...trade, exitPrice: lastExitDigits });
      } else {
        onTradeChange({ ...trade, exitPrice: value });
      }
    }
  };

  return (
  // Inside TradeForm component return statement
<div className="bg-[#1E1E1E] p-4 sm:p-6 lg:p-8 rounded-xl space-y-4 sm:space-y-6">
  <div className="text-xl sm:text-2xl font-bold mb-2 sm:mb-4 text-white">
    Balance: ${balance.toFixed(2)}
  </div>

  <Input
    label="Entry Price"
    value={trade.entryPrice || lastEntryDigits}
    onChange={(e) => handleNewTrade('entry', e.target.value)}
    placeholder="Enter price"
    className="text-base sm:text-lg"
  />

  <Input
    label="Exit Price"
    value={trade.exitPrice || lastExitDigits}
    onChange={(e) => handleNewTrade('exit', e.target.value)}
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