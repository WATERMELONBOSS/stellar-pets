import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { DollarSign } from 'lucide-react';

interface FeedingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (amount: number) => void;
  currentBalance: number;
  loading: boolean;
}

export const FeedingModal: React.FC<FeedingModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  currentBalance,
  loading,
}) => {
  const [amount, setAmount] = useState(50);

  const presetAmounts = [25, 50, 100, 200];

  const handleConfirm = () => {
    if (amount > 0 && amount <= currentBalance) {
      onConfirm(amount);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="🍖 Feed Your Pet" maxWidth="md">
      <div className="space-y-6">
        {/* Current Balance */}
        <div className="bg-slate-700/50 rounded-lg p-4">
          <div className="text-sm text-gray-400 mb-1">Available Balance</div>
          <div className="text-2xl font-bold text-green-400">
            ${currentBalance.toFixed(2)} USDC
          </div>
        </div>

        {/* Amount Input */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Feeding Amount
          </label>
          <div className="relative">
            <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              min={1}
              max={currentBalance}
              className="w-full bg-slate-700 border border-slate-600 rounded-lg pl-10 pr-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Enter amount"
            />
          </div>
        </div>

        {/* Preset Amounts */}
        <div>
          <div className="text-sm text-gray-400 mb-2">Quick Select</div>
          <div className="grid grid-cols-4 gap-2">
            {presetAmounts.map((preset) => (
              <button
                key={preset}
                onClick={() => setAmount(preset)}
                disabled={preset > currentBalance}
                className={`
                  py-2 rounded-lg font-medium transition-all
                  ${amount === preset 
                    ? 'bg-purple-600 text-white' 
                    : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
                  }
                  disabled:opacity-30 disabled:cursor-not-allowed
                `}
              >
                ${preset}
              </button>
            ))}
          </div>
        </div>

        {/* Impact Preview */}
        <div className="bg-green-900/20 border border-green-500/20 rounded-lg p-4">
          <div className="text-sm font-medium text-green-400 mb-2">
            Expected Results
          </div>
          <div className="space-y-1 text-sm text-gray-300">
            <div className="flex justify-between">
              <span>Health Gain:</span>
              <span className="text-green-400 font-bold">+20 HP</span>
            </div>
            <div className="flex justify-between">
              <span>Happiness Gain:</span>
              <span className="text-yellow-400 font-bold">+25 HP</span>
            </div>
            <div className="flex justify-between">
              <span>Streak Bonus:</span>
              <span className="text-purple-400 font-bold">+1 Day</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Button
            variant="secondary"
            onClick={onClose}
            className="flex-1"
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            variant="success"
            onClick={handleConfirm}
            className="flex-1"
            loading={loading}
            disabled={amount <= 0 || amount > currentBalance}
          >
            Feed Pet
          </Button>
        </div>
      </div>
    </Modal>
  );
};
