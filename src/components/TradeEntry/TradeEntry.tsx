"use client";

import { useState, useEffect } from "react";
import { SettingsModal } from "../Settings/SettingsModal";
import { Settings, Trade } from "@/utils/types";
import { CogIcon, TrashIcon } from "@heroicons/react/24/outline";
import ClientOnly from "../ClientOnly";
import { TradeForm } from "./TradeForm";
import { TradeHistory } from "./TradeHistory";
import { BalanceChart } from "./BalanceChart";
import { calculateTradeResults } from "./TradeCalculator";
import { TradeFormData } from "./types";

const DEFAULT_SETTINGS: Settings = {
  leverage: 20,
  exchangeFee: 0.04,
  initialBalance: 10000,
};

export const TradeEntry = () => {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const [trade, setTrade] = useState<TradeFormData>({
    entryPrice: "",
    exitPrice: "",
    positionUSD: "",
    leverage: DEFAULT_SETTINGS.leverage,
  });
  const [balance, setBalance] = useState(DEFAULT_SETTINGS.initialBalance);
  const [tradeHistory, setTradeHistory] = useState<Trade[]>([]);

  useEffect(() => {
    const savedSettings = localStorage.getItem("settings");
    const savedTradeHistory = localStorage.getItem("tradeHistory");
    const savedBalance = localStorage.getItem("balance");

    if (savedSettings) setSettings(JSON.parse(savedSettings));
    if (savedTradeHistory) setTradeHistory(JSON.parse(savedTradeHistory));
    if (savedBalance) setBalance(Number(savedBalance));
  }, []);

  useEffect(() => {
    localStorage.setItem("settings", JSON.stringify(settings));
    localStorage.setItem("balance", String(balance));
  }, [settings, balance]);

  const handleSaveSettings = (newSettings: Settings) => {
    setSettings(newSettings);
    setTrade((prev) => ({ ...prev, leverage: newSettings.leverage }));
  };

  const clearAllData = () => {
    if (
      window.confirm(
        "Are you sure you want to clear all data and start a new Trading Journal?"
      )
    ) {
      localStorage.clear();
      setTradeHistory([]);
      setBalance(settings.initialBalance);
      setTrade((prev) => ({
        ...prev,
        entryPrice: "",
        exitPrice: "",
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

    const updatedHistory = [newTrade, ...tradeHistory];
    setTradeHistory(updatedHistory);
    localStorage.setItem('tradeHistory', JSON.stringify(updatedHistory));
    setBalance(prev => prev + results.pnlUSD);
    
    // Clear form but keep position size
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
            {/* Left side - Trade Form */}
            <div className="w-full lg:w-[400px] xl:w-[500px] order-1">
              <TradeForm
                trade={trade}
                onTradeChange={setTrade}
                onSubmitLong={() => submitTrade(true)}
                onSubmitShort={() => submitTrade(false)}
                balance={balance}
              />

              <div className="mt-3 sm:mt-4 max-h-[400px] lg:max-h-[600px] overflow-y-auto custom-scrollbar">
                <TradeHistory trades={tradeHistory} settings={settings} />
              </div>
            </div>

            {/* Right side - Chart */}
            <div className="flex-1">
              <div className="h-[400px] sm:h-[500px] lg:h-[800px]">
                <BalanceChart tradeHistory={tradeHistory} settings={settings} />
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
