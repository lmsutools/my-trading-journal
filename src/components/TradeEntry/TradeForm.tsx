'use client';

import { InputHTMLAttributes, useRef, useEffect } from 'react';
import { ArrowUturnLeftIcon, ArrowUturnRightIcon } from '@heroicons/react/24/outline';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  prefix?: string;
  suffix?: string;
  className?: string;
  numericType?: 'position' | 'percentage' | null;
}

const Input = ({ label, prefix, suffix, className = '', numericType, ...props }: InputProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    if (numericType && inputRef.current) {
      const value = inputRef.current.value;
      inputRef.current.setSelectionRange(0, value.indexOf('.') !== -1 ? value.indexOf('.') : value.length);
    }
  };

  return (
    <div className="space-y-1">
      {label && <label className="text-gray-400 text-sm">{label}</label>}
      <div className="relative">
        {prefix && <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">{prefix}</span>}
        <input
          ref={inputRef}
          onClick={handleClick}
          {...props}
          className={`w-full bg-[#252525] text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 
            ${prefix ? 'pl-6' : ''} ${suffix ? 'pr-6' : ''} ${className}`}
        />
        {suffix && <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">{suffix}</span>}
      </div>
    </div>
  );
};

interface TradeFormData {
  entryPrice: string;
  exitPrice: string;
  positionUSD: string;
  leverage: number;
  balancePercentage: string;
}

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
  const lastValues = useRef({ entryPrice: '', exitPrice: '', balancePercentage: '', positionUSD: '' });

  useEffect(() => {
    if (!trade.entryPrice && !trade.exitPrice) {
      const savedTrades = localStorage.getItem('tradeHistory');
      if (savedTrades) {
        const trades = JSON.parse(savedTrades);
        if (trades.length > 0) {
          const lastTrade = trades[0];
          const values = {
            entryPrice: String(lastTrade.entryPrice).slice(0, 2),
            exitPrice: String(lastTrade.exitPrice).slice(0, 2),
            balancePercentage: lastTrade.balancePercentage || '',
            positionUSD: lastTrade.positionUSD || ''
          };
          lastValues.current = values;
          onTradeChange({ ...trade, ...values });
        }
      }
    }
  }, [trade, onTradeChange]);

  useEffect(() => {
    if (trade.balancePercentage && balance > 0) {
      const newPositionSize = ((balance * Number(trade.balancePercentage)) / 100).toFixed(2);
      if (newPositionSize !== trade.positionUSD) {
        onTradeChange({ ...trade, positionUSD: newPositionSize });
      }
    }
  }, [balance, trade, onTradeChange]);

  const formatNumericInput = (value: string) => {
    const cleanValue = value.replace(/[^\d.]/g, '');
    const [whole, decimal] = cleanValue.split('.');
    if (!decimal) return cleanValue;
    return `${whole}.${decimal.slice(0, 2)}`;
  };

  const handlePositionUSDChange = (value: string) => {
    if (balance <= 0) return;

    const formattedValue = formatNumericInput(value);
    const newPercentage = formattedValue 
      ? Math.min((Number(formattedValue) / balance) * 100, 100).toFixed(2) 
      : '';

    onTradeChange({
      ...trade,
      positionUSD: formattedValue,
      balancePercentage: newPercentage
    });
  };

  const handlePercentageChange = (value: string) => {
    if (balance <= 0) return;

    const formattedValue = formatNumericInput(value);
    const percentage = Math.min(Number(formattedValue), 100);
    const newPosition = formattedValue 
      ? ((balance * percentage) / 100).toFixed(2) 
      : '';

    onTradeChange({
      ...trade,
      positionUSD: newPosition,
      balancePercentage: percentage.toString()
    });
  };

  return (
    <div className="bg-[#1E1E1E] p-4 sm:p-6 lg:p-8 rounded-xl space-y-4 sm:space-y-6">
      <div className="text-xl sm:text-2xl font-bold mb-2 sm:mb-4 text-white">
        Balance: ${balance.toFixed(2)}
      </div>
      
      <Input
        label="Entry Price"
        value={trade.entryPrice}
        onChange={(e) => onTradeChange({ ...trade, entryPrice: e.target.value })}
        className="text-base sm:text-lg"
      />
      
      <Input
        label="Exit Price"
        value={trade.exitPrice}
        onChange={(e) => onTradeChange({ ...trade, exitPrice: e.target.value })}
        className="text-base sm:text-lg"
      />
      
      <div className="space-y-2">
        <label className="text-gray-400 text-sm">Position Size</label>
        <div className="flex gap-2">
          <div className="flex-1">
            <Input
              value={trade.positionUSD}
              onChange={(e) => handlePositionUSDChange(e.target.value)}
              className="text-base sm:text-lg"
              prefix="$"
              numericType="position"
            />
          </div>
          <div className="w-24">
            <Input
              value={trade.balancePercentage}
              onChange={(e) => handlePercentageChange(e.target.value)}
              className="text-base sm:text-lg text-right"
              suffix="%"
              numericType="percentage"
            />
          </div>
        </div>
      </div>
      
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