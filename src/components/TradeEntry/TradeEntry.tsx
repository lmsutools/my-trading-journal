'use client';

import { useState, useEffect } from 'react';
import { SettingsModal } from '../Settings/SettingsModal';
import { Settings, Trade } from '@/utils/types';
import { CogIcon, TrashIcon } from '@heroicons/react/24/outline';
import ClientOnly from '../ClientOnly';
import { TradeForm } from './TradeForm';
import { TradeHistory } from './TradeHistory';
import { BalanceChart } from './BalanceChart';
import { calculateTradeResults } from './TradeCalculator';
import { calculatePerformanceMetrics } from "@/utils/calculations";
import { Performance } from "./Performance";
import { TradeFormData } from './types';

const DEFAULT_SETTINGS: Settings = {
  leverage: 20,
  exchangeFee: 0.04,
  initialBalance: 10000,
};

export const TradeEntry = () => {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const [trade, setTrade] = useState<TradeFormData>({
    entryPrice: '',
    exitPrice: '',
    positionUSD: '',
    leverage: DEFAULT_SETTINGS.leverage,
  });
  const [balance, setBalance] = useState(DEFAULT_SETTINGS.initialBalance);
  const [tradeHistory, setTradeHistory] = useState<Trade[]>([]);
  const [canUndo, setCanUndo] = useState(false);
  const [undoMessage, setUndoMessage] = useState<string | null>(null);
  const [undoneTradesStack, setUndoneTradesStack] = useState<Trade[]>([]);

  useEffect(() => {
    const savedSettings = localStorage.getItem('settings');
    const savedTradeHistory = localStorage.getItem('tradeHistory');
    const savedBalance = localStorage.getItem('balance');
    const savedUndoneStack = localStorage.getItem('undoneStack');

    if (savedSettings) setSettings(JSON.parse(savedSettings));
    if (savedTradeHistory) {
      setTradeHistory(JSON.parse(savedTradeHistory));
      setCanUndo(JSON.parse(savedTradeHistory).length > 0);
    }
    if (savedBalance) setBalance(Number(savedBalance));
    if (savedUndoneStack) setUndoneTradesStack(JSON.parse(savedUndoneStack));
  }, []);

  useEffect(() => {
    localStorage.setItem('settings', JSON.stringify(settings));
    localStorage.setItem('balance', String(balance));
    localStorage.setItem('undoneStack', JSON.stringify(undoneTradesStack));
  }, [settings, balance, undoneTradesStack]);

  const handleSaveSettings = (newSettings: Settings) => {
    if (newSettings.initialBalance !== settings.initialBalance) {
      setBalance(newSettings.initialBalance);
    }
    setSettings(newSettings);
    setTrade(prev => ({ ...prev, leverage: newSettings.leverage }));
  };

  const handleUndo = () => {
    if (tradeHistory.length === 0) return;
    
    const lastTrade = tradeHistory[0];
    const newTradeHistory = tradeHistory.slice(1);
    
    setUndoneTradesStack(prev => [lastTrade, ...prev]);
    setTradeHistory(newTradeHistory);
    setBalance(prev => prev - (lastTrade.pnlUSD || 0));
    setUndoMessage("Last trade has been undone");
    setCanUndo(newTradeHistory.length > 0);
    
    localStorage.setItem('tradeHistory', JSON.stringify(newTradeHistory));
  };

  const handleRedo = () => {
    if (undoneTradesStack.length === 0) return;

    const tradeToRedo = undoneTradesStack[0];
    const newUndoneStack = undoneTradesStack.slice(1);

    setUndoneTradesStack(newUndoneStack);
    setTradeHistory(prev => [tradeToRedo, ...prev]);
    setBalance(prev => prev + (tradeToRedo.pnlUSD || 0));
    setUndoMessage("Last trade has been redone");
    setCanUndo(true);

    localStorage.setItem('undoneStack', JSON.stringify(newUndoneStack));
  };

  const clearAllData = () => {
    if (window.confirm('Are you sure you want to clear all data and start a new Trading Journal?')) {
      localStorage.clear();
      setTradeHistory([]);
      setUndoneTradesStack([]);
      setBalance(settings.initialBalance);
      setCanUndo(false);
      setUndoMessage(null);
      setTrade(prev => ({
        ...prev,
        entryPrice: '',
        exitPrice: '',
        positionUSD: prev.positionUSD,
        leverage: settings.leverage,
      }));
    }
  };

  const submitTrade = (isLong: boolean) => {
    if (!trade.entryPrice || !trade.exitPrice || !trade.positionUSD) {
      alert('Please fill in all fields');
      return;
    }

    const results = calculateTradeResults(
      Number(trade.entryPrice),
      Number(trade.exitPrice),
      Number(trade.positionUSD),
      isLong,
      settings
    );

    if (!results) return;

    const newTrade: Trade = {
      id: Date.now().toString(),
      ...trade,
      isLong,
      pnlPercentage: results.pnlPercentage,
      pnlUSD: results.pnlUSD,
      timestamp: Date.now(),
    };

    setUndoneTradesStack([]); // Clear redo stack when new trade is submitted
    const updatedHistory = [newTrade, ...tradeHistory];
    setTradeHistory(updatedHistory);
    localStorage.setItem('tradeHistory', JSON.stringify(updatedHistory));
    setBalance(prev => prev + results.pnlUSD);
    setUndoMessage(null);
    setCanUndo(true);

    const currentPositionSize = trade.positionUSD;
    setTrade({
      entryPrice: '',
      exitPrice: '',
      positionUSD: currentPositionSize,
      leverage: settings.leverage,
    });
  };

  return (
    <ClientOnly>
      <div className="min-h-screen bg-[#121212] p-3 sm:p-4">
        <div className="max-w-[1800px] mx-auto">
          <div className="flex justify-between items-center mb-4 sm:mb-6">
            <h1 className="text-2xl sm:text-3xl font-bold text-white">
              Trading Journal
            </h1>
            <div className="flex gap-2 sm:gap-4">
              <button
                onClick={clearAllData}
                className="p-2 sm:p-3 hover:bg-[#252525] rounded-lg text-red-500 transition-colors"
              >
                <TrashIcon className="w-6 h-6 sm:w-7 sm:h-7" />
              </button>
              <button
                onClick={() => setIsSettingsOpen(true)}
                className="p-2 sm:p-3 hover:bg-[#252525] rounded-lg text-white transition-colors"
              >
                <CogIcon className="w-6 h-6 sm:w-7 sm:h-7" />
              </button>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-3 sm:gap-4">
            <div className="w-full lg:w-[400px] xl:w-[500px]">
              <TradeForm
                trade={trade}
                onTradeChange={setTrade}
                onSubmitLong={() => submitTrade(true)}
                onSubmitShort={() => submitTrade(false)}
                balance={balance}
                onUndo={handleUndo}
                onRedo={handleRedo}
                canUndo={canUndo}
                canRedo={undoneTradesStack.length > 0}
                undoMessage={undoMessage}
              />
              <div className="mt-3 sm:mt-4 max-h-[400px] lg:max-h-[600px] overflow-y-auto custom-scrollbar">
                <TradeHistory trades={tradeHistory} settings={settings} />
              </div>
            </div>
            <div className="flex-1">
              <div className="flex flex-col gap-3 sm:gap-4">
                <div className="h-fit">
                  <BalanceChart tradeHistory={tradeHistory} settings={settings} />
                </div>
                <Performance metrics={calculatePerformanceMetrics(tradeHistory, settings.initialBalance)} />
              </div>
            </div>
          </div>
        </div>

        <SettingsModal
          isOpen={isSettingsOpen}
          onClose={() => setIsSettingsOpen(false)}
          settings={settings}
          onSave={handleSaveSettings}
        />
      </div>
    </ClientOnly>
  );
};