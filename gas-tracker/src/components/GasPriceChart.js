import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp } from 'lucide-react';
import { NETWORK_CONFIG } from '../services/GasDataService';

/**
 * Gas Price Chart Component
 * Displays real-time gas price trends across different blockchain networks
 */
const GasPriceChart = ({ gasData, height = 320 }) => {
  const enabledChains = Object.keys(gasData).filter(chain => gasData[chain].length > 0);
  
  // Create combined data for the chart
  const combineData = () => {
    if (enabledChains.length === 0) return [];
    
    const baseData = gasData[enabledChains[0]] || [];
    return baseData.map((item, index) => {
      const combined = { time: item.time };
      
      enabledChains.forEach(chain => {
        if (gasData[chain][index]) {
          combined[`${chain}_price`] = gasData[chain][index].price;
          combined[`${chain}_baseFee`] = gasData[chain][index].baseFee;
          combined[`${chain}_priorityFee`] = gasData[chain][index].priorityFee;
        }
      });
      
      return combined;
    });
  };

  const chartData = combineData();

  // Custom tooltip component
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-900 border border-white/20 rounded-lg p-3 shadow-lg">
          <p className="text-white font-medium mb-2">{label}</p>
          {payload.map((entry) => {
            const chain = entry.dataKey.replace('_price', '');
            const config = NETWORK_CONFIG[chain];
            
            return (
              <div key={entry.dataKey} className="flex items-center space-x-2 mb-1">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: entry.color }}
                />
                <span className="text-gray-300 text-sm">
                  {config?.name}: 
                  <span className="text-white font-mono ml-1">
                    {entry.value} gwei
                  </span>
                </span>
              </div>
            );
          })}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">Gas Price Volatility</h2>
        <div className="flex items-center space-x-2 text-sm text-gray-300">
          <TrendingUp size={16} />
          <span>Live Updates Every 6s</span>
        </div>
      </div>
      
      {chartData.length === 0 ? (
        <div className="flex items-center justify-center h-80 text-gray-400">
          <div className="text-center">
            <TrendingUp size={48} className="mx-auto mb-4 opacity-50" />
            <p>Loading chart data...</p>
          </div>
        </div>
      ) : (
        <div style={{ height }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis
                dataKey="time"
                stroke="rgba(255,255,255,0.7)"
                fontSize={12}
                tick={{ fill: 'rgba(255,255,255,0.7)' }}
              />
              <YAxis
                stroke="rgba(255,255,255,0.7)"
                fontSize={12}
                tick={{ fill: 'rgba(255,255,255,0.7)' }}
                label={{ 
                  value: 'Gas Price (gwei)', 
                  angle: -90, 
                  position: 'insideLeft',
                  style: { textAnchor: 'middle', fill: 'rgba(255,255,255,0.7)' }
                }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend 
                wrapperStyle={{ color: 'rgba(255,255,255,0.7)' }}
              />
              
              {/* Render lines for each enabled chain */}
              {enabledChains.map(chain => {
                const config = NETWORK_CONFIG[chain];
                return (
                  <Line
                    key={chain}
                    type="monotone"
                    dataKey={`${chain}_price`}
                    stroke={config?.color || '#ffffff'}
                    strokeWidth={2}
                    dot={{ 
                      fill: config?.color || '#ffffff', 
                      strokeWidth: 2, 
                      r: 3 
                    }}
                    name={config?.name || chain}
                    connectNulls={false}
                    animationDuration={300}
                  />
                );
              })}
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
      
      {/* Chart Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 pt-4 border-t border-white/20">
        {enabledChains.map(chain => {
          const config = NETWORK_CONFIG[chain];
          const latestData = gasData[chain]?.[gasData[chain].length - 1];
          
          if (!latestData) return null;
          
          return (
            <div key={chain} className="text-center">
              <div 
                className="text-lg font-bold"
                style={{ color: config?.color }}
              >
                {latestData.price} gwei
              </div>
              <div className="text-sm text-gray-400">
                {config?.name} Latest
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default GasPriceChart;