import React from 'react';
import { Zap, Wallet } from 'lucide-react';

const CostComparison = ({ simulationResults, chainColors, chainNames }) => {
  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
      <div className="flex items-center space-x-3 mb-6">
        <Zap size={24} className="text-yellow-400" />
        <h2 className="text-2xl font-bold">Cost Comparison</h2>
      </div>
      {simulationResults ? (
        <div className="space-y-4">
          {Object.entries(simulationResults)
            .sort(([,a], [,b]) => parseFloat(a.totalCost) - parseFloat(b.totalCost))
            .map(([chain, results], index) => (
              <div
                key={chain}
                className={`p-4 rounded-lg border-2 ${
                  index === 0 ? 'border-green-400 bg-green-400/10' : 'border-white/20 bg-white/5'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-lg" style={{ color: chainColors[chain] }}>
                    {chainNames[chain]}
                  </h3>
                  {index === 0 && (
                    <span className="px-2 py-1 bg-green-400 text-green-900 text-xs font-bold rounded-full">
                      CHEAPEST
                    </span>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-gray-400">Gas Cost:</span>
                    <div className="font-mono">{results.gasInGwei} gwei</div>
                    <div className="font-mono text-xs text-gray-400">{results.gasInEth} ETH</div>
                  </div>
                  <div>
                    <span className="text-gray-400">Gas (USD):</span>
                    <div className="font-mono">${results.gasCostUsd}</div>
                  </div>
                  <div className="col-span-2 pt-2 border-t border-white/20">
                    <span className="text-gray-400">Total Cost:</span>
                    <div className="font-mono font-bold text-lg" style={{ color: chainColors[chain] }}>
                      ${results.transactionCostUsd}
                    </div>
                  </div>
                </div>
              </div>
            ))}
        </div>
      ) : (
        <div className="text-center text-gray-400 py-8">
          <Wallet size={48} className="mx-auto mb-4 opacity-50" />
          <p>Enter transaction value to see cost comparison</p>
        </div>
      )}
    </div>
  );
};

export default CostComparison;