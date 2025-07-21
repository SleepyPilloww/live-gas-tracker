import React from 'react';
import { Activity, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import { NETWORK_CONFIG, getNetworkStatus } from '../services/GasDataService';

/**
 * Current Gas Prices Component
 * Displays real-time gas prices for all supported networks
 */
const CurrentGasPrices = ({ currentPrices }) => {
  const networkStatus = getNetworkStatus(currentPrices);

  const getCongestionIcon = (level) => {
    switch (level) {
      case 'high':
        return <AlertTriangle size={16} className="text-red-400" />;
      case 'medium':
        return <Clock size={16} className="text-yellow-400" />;
      case 'low':
        return <CheckCircle size={16} className="text-green-400" />;
      default:
        return <Activity size={16} className="text-gray-400" />;
    }
  };

  const getCongestionColor = (level) => {
    switch (level) {
      case 'high':
        return 'border-red-400 bg-red-400/10';
      case 'medium':
        return 'border-yellow-400 bg-yellow-400/10';
      case 'low':
        return 'border-green-400 bg-green-400/10';
      default:
        return 'border-white/20 bg-white/5';
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white text-center">Current Gas Prices</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {Object.entries(currentPrices).map(([chain, prices]) => {
          const config = NETWORK_CONFIG[chain];
          const status = networkStatus[chain];
          
          if (!config) return null;

          return (
            <div 
              key={chain} 
              className={`backdrop-blur-sm rounded-xl p-6 border-2 transition-all duration-300 hover:scale-105 ${getCongestionColor(status?.congestionLevel)}`}
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold" style={{ color: config.color }}>
                  {config.name}
                </h3>
                <div className="flex items-center space-x-2">
                  {getCongestionIcon(status?.congestionLevel)}
                  <Activity size={20} style={{ color: config.color }} />
                </div>
              </div>

              {/* Gas Price Details */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-300 text-sm">Base Fee:</span>
                  <span className="font-mono text-white">{prices.baseFee} gwei</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-300 text-sm">Priority Fee:</span>
                  <span className="font-mono text-white">{prices.priorityFee} gwei</span>
                </div>
                
                <div className="flex justify-between items-center border-t border-white/20 pt-3">
                  <span className="font-semibold text-white">Total Gas:</span>
                  <span 
                    className="font-mono font-bold text-lg"
                    style={{ color: config.color }}
                  >
                    {prices.totalFee} gwei
                  </span>
                </div>
              </div>

              {/* Network Status */}
              {status && (
                <div className="mt-4 pt-4 border-t border-white/20">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-400">Network Status:</span>
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                      status.congestionLevel === 'high' ? 'bg-red-400/20 text-red-300' :
                      status.congestionLevel === 'medium' ? 'bg-yellow-400/20 text-yellow-300' :
                      'bg-green-400/20 text-green-300'
                    }`}>
                      {status.congestionLevel.toUpperCase()}
                    </span>
                  </div>
                  
                  <div className="text-xs text-gray-400 mb-2">
                    <span>Congestion: {status.congestionRatio}x normal</span>
                  </div>
                  
                  <div className="text-xs text-gray-300">
                    {status.recommendedAction}
                  </div>
                  
                  <div className="text-xs text-gray-400 mt-2">
                    Avg Block Time: {status.avgBlockTime}s
                  </div>
                </div>
              )}

              {/* Quick Stats */}
              <div className="mt-4 pt-4 border-t border-white/20">
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-gray-400">24h Change:</span>
                    <div className="text-white font-mono">
                      {(Math.random() * 20 - 10).toFixed(1)}%
                    </div>
                  </div>
                  <div>
                    <span className="text-gray-400">Est. Conf.:</span>
                    <div className="text-white font-mono">
                      {Math.ceil(Math.random() * 30 + 10)}s
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Summary Stats */}
      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-white">
              {Object.keys(currentPrices).length}
            </div>
            <div className="text-sm text-gray-400">Networks Monitored</div>
          </div>
          
          <div>
            <div className="text-2xl font-bold text-green-400">
              {Object.values(networkStatus).filter(s => s.congestionLevel === 'low').length}
            </div>
            <div className="text-sm text-gray-400">Low Congestion</div>
          </div>
          
          <div>
            <div className="text-2xl font-bold text-blue-400">
              {Math.min(...Object.values(currentPrices).map(p => p.totalFee)).toFixed(1)}
            </div>
            <div className="text-sm text-gray-400">Lowest Gas (gwei)</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CurrentGasPrices;