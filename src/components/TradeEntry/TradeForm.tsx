'use client';

import { Input } from '../UI/Input';
import { TradeFormData } from './types';
import { useEffect, useRef } from 'react';
import { ArrowUturnLeftIcon, ArrowUturnRightIcon } from '@heroicons/react/24/outline';

interface TradeFormProps {
  trade: TradeFormData;
  onTradeChange: (trade: TradeFormData) => void;
  onSubmitLong: () => void;
  onSubmitShort: () => void;
  balance: number;
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  undoMessage: string | null;
}

export const TradeForm = ({ 
  trade, 
  onTradeChange, 
  onSubmitLong, 
  onSubmitShort, 
  balance,
  onUndo,
  onRedo,
  canUndo,
  canRedo,
  undoMessage
}: TradeFormProps) => {
  const lastValues = useRef({
    entryPrice: '',
    exitPrice: ''
  });

  useEffect(() => {
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

      <div className="space-y-3">
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
          <div className="flex gap-2">
            {canUndo && (
              <button
                onClick={onUndo}
                className="px-4 py-3 sm:py-4 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
                title="Undo last trade"
              >
                <ArrowUturnLeftIcon className="w-6 h-6" />
              </button>
            )}
            {canRedo && (
              <button
                onClick={onRedo}
                className="px-4 py-3 sm:py-4 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
                title="Redo last undone trade"
              >
                <ArrowUturnRightIcon className="w-6 h-6" />
              </button>
            )}
          </div>
        </div>
        {undoMessage && (
          <div className="text-green-500 text-sm text-center animate-fade-out">
            {undoMessage}
          </div>
        )}
      </div>
    </div>
  );
};