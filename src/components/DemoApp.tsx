import React from "react";
import { useWallet } from "../hooks/useWallet";
import { usePet } from "../hooks/usePet";

const DemoApp: React.FC = () => {
  const wallet = useWallet();
  const pet = usePet();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-slate-900 to-orange-900 p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
            🎃 Stellar Pets Foundation
          </h1>
          <p className="text-gray-400">
            Core infrastructure ready for integration!
          </p>
        </div>

        {/* Wallet Status */}
        <div className="bg-slate-800/50 backdrop-blur border border-purple-500/20 rounded-2xl p-6">
          <h2 className="text-xl font-bold text-purple-300 mb-4">
            💼 Wallet Status
          </h2>
          {!wallet.isConnected ? (
            <button
              onClick={wallet.connect}
              disabled={wallet.connecting}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold py-4 rounded-xl transition-all disabled:opacity-50"
            >
              {wallet.connecting ? "Connecting..." : "🔗 Connect Wallet"}
            </button>
          ) : (
            <div className="space-y-3">
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-400">Address:</span>
                <span className="text-purple-300 font-mono">
                  {wallet.publicKey?.slice(0, 8)}...
                  {wallet.publicKey?.slice(-8)}
                </span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-400">Balance:</span>
                <span className="text-green-400 font-bold">
                  ${wallet.balance.toFixed(2)} USDC
                </span>
              </div>
              <button
                onClick={wallet.disconnect}
                className="w-full bg-red-600/20 hover:bg-red-600/30 text-red-400 py-2 rounded-lg transition-all text-sm"
              >
                Disconnect
              </button>
            </div>
          )}
        </div>

        {/* Pet Status */}
        {wallet.isConnected && (
          <div className="bg-slate-800/50 backdrop-blur border border-orange-500/20 rounded-2xl p-6">
            <h2 className="text-xl font-bold text-orange-300 mb-4">
              🐉 Pet Status
            </h2>

            {pet.loading ? (
              <div className="text-center py-8 text-gray-400">
                Loading pet data...
              </div>
            ) : !pet.currentPet ? (
              <div className="text-center py-8">
                <p className="text-gray-400 mb-4">
                  No pet found. Mint your first pet!
                </p>
                <button
                  onClick={() => pet.mintPet("dragon", "Sparkles")}
                  className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 text-white font-bold py-3 px-8 rounded-xl transition-all"
                >
                  🥚 Mint Dragon
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="text-center">
                  <div className="text-6xl mb-2">
                    {pet.currentPet.type === "dragon"
                      ? "🐉"
                      : pet.currentPet.type === "pig"
                      ? "🐷"
                      : "🐶"}
                  </div>
                  <h3 className="text-2xl font-bold text-white">
                    {pet.currentPet.name}
                  </h3>
                  <p className="text-gray-400 text-sm">
                    Level {pet.currentPet.level} •{" "}
                    {pet.currentPet.feedingStreak} day streak
                  </p>
                </div>

                {/* Health Bar */}
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-red-400">❤️ Health</span>
                    <span className="text-white font-bold">
                      {pet.currentPet.health}/100
                    </span>
                  </div>
                  <div className="w-full bg-slate-700 rounded-full h-3">
                    <div
                      className="bg-gradient-to-r from-red-500 to-pink-500 h-3 rounded-full transition-all duration-500"
                      style={{ width: `${pet.currentPet.health}%` }}
                    />
                  </div>
                </div>

                {/* Happiness Bar */}
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-yellow-400">😊 Happiness</span>
                    <span className="text-white font-bold">
                      {pet.currentPet.happiness}/100
                    </span>
                  </div>
                  <div className="w-full bg-slate-700 rounded-full h-3">
                    <div
                      className="bg-gradient-to-r from-yellow-500 to-orange-500 h-3 rounded-full transition-all duration-500"
                      style={{ width: `${pet.currentPet.happiness}%` }}
                    />
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-3 pt-4">
                  <div className="bg-slate-700/50 rounded-lg p-3 text-center">
                    <div className="text-green-400 font-bold text-xl">
                      ${pet.currentPet.totalStaked}
                    </div>
                    <div className="text-gray-400 text-xs">Total Staked</div>
                  </div>
                  <div className="bg-slate-700/50 rounded-lg p-3 text-center">
                    <div className="text-purple-400 font-bold text-xl">
                      {pet.currentPet.feedingStreak}
                    </div>
                    <div className="text-gray-400 text-xs">Feeding Streak</div>
                  </div>
                </div>

                {/* Actions */}
                <div className="grid grid-cols-2 gap-3 pt-4">
                  <button
                    onClick={() => pet.feedPet(50)}
                    disabled={pet.loading}
                    className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white font-bold py-3 rounded-xl transition-all disabled:opacity-50"
                  >
                    🍖 Feed ($50)
                  </button>
                  <button
                    onClick={() => pet.withdrawFunds(25)}
                    disabled={pet.loading}
                    className="bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 text-white font-bold py-3 rounded-xl transition-all disabled:opacity-50"
                  >
                    💸 Withdraw
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Integration Guide */}
        <div className="bg-slate-800/50 backdrop-blur border border-green-500/20 rounded-2xl p-6">
          <h2 className="text-xl font-bold text-green-300 mb-4">
            🔌 Integration Points
          </h2>
          <div className="space-y-2 text-sm text-gray-300">
            <p>
              ✅ <strong>WalletContext</strong> - Connect Freighter wallet
            </p>
            <p>
              ✅ <strong>PetContext</strong> - Smart contract calls for mint,
              feed, withdraw
            </p>
            <p>
              ✅ <strong>Types</strong> - All TypeScript interfaces defined
            </p>
            <p>
              ✅ <strong>Config</strong> - Update with your contract addresses
            </p>
            <p className="pt-2 text-purple-400">
              👉 Search for "🔌" in code to find integration points!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DemoApp;
