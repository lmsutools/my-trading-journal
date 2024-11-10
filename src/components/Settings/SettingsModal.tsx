import { useState } from 'react';
import { Modal } from '../UI/Modal';
import { Input } from '../UI/Input';
import { Settings } from '@/utils/types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: Settings;
  onSave: (settings: Settings) => void;
}

export const SettingsModal = ({ isOpen, onClose, settings, onSave }: SettingsModalProps) => {
  const [localSettings, setLocalSettings] = useState<Settings>(settings);

  const handleSave = () => {
    onSave(localSettings);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Trading Settings">
      <div className="space-y-4">
        <Input
          label="Leverage"
          value={localSettings.leverage}
          onChange={(e) => setLocalSettings({
            ...localSettings,
            leverage: Number(e.target.value)
          })}
          placeholder="Enter leverage (e.g., 20)"
        />

        <Input
          label="Exchange Fee %"
          value={localSettings.exchangeFee}
          onChange={(e) => setLocalSettings({
            ...localSettings,
            exchangeFee: Number(e.target.value)
          })}
          placeholder="Enter fee percentage (e.g., 0.04)"
        />

        <Input
          label="Initial Balance (USD)"
          value={localSettings.initialBalance}
          onChange={(e) => setLocalSettings({
            ...localSettings,
            initialBalance: Number(e.target.value)
          })}
          placeholder="Enter initial balance"
        />

        <button
          onClick={handleSave}
          className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold"
        >
          Save Settings
        </button>
      </div>
    </Modal>
  );
};