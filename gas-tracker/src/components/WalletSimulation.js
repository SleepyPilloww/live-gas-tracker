import React from 'react';
import { Wallet, RefreshCw } from 'lucide-react';

const WalletSimulation = ({
  simulationMode,
  setSimulationMode,
  transactionValue,
  setTransactionValue,
  runSimulation
}) => {
  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
      <div className="flex items-center space-x-3 mb-6">
        <Wallet size={24} className="text-green-400" />
        <h2 className="text-2xl font-bold">Wallet Simulation</h2>
      </div>
      <div className="space-y-4">
        {/* Mode Toggle */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-300">Simulation Mode</label>
          <div className="flex space-x-2">
            <button
              onClick={() => setSimulationMode('live')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                simulationMode === 'live'
                  ? 'bg-green-600 text-white'
                  : 'bg-white/20 text-gray-300 hover:bg-white/30'
              }`}
            >
              Live Mode
            </button>
            <button
              onClick={() => setSimulationMode('simulation')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                simulationMode === 'simulation'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white/20 text-gray-300 hover:bg-white/30'
              }`}
            >
              Simulation Mode
            </button>
          </div>
        </div>

        {/* Transaction Value Input */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-300">Transaction Value (ETH)</label>
          <input
            type="number"
            step="0.1"
            value={transactionValue}
            onChange={(e) => setTransactionValue(e.target.value)}
            className="w-full px-3 py-2 bg-white/20 border border-white/30 rounded-lg text-white
              placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="0.5"
          />
        </div>

        {/* Manual Simulation Button */}
        {simulationMode === 'simulation' && (
          <button
            onClick={runSimulation}
            className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-gradient-to-r
              from-blue-600 to-purple-600 rounded-lg text-white font-medium hover:from-blue-700 hover:to-purple-700
              transition-all"
          >
            <RefreshCw size={16} />
            <span>Run Simulation</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default WalletSimulation;