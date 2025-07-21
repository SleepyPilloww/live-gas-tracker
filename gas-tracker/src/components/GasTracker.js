import React, { useState, useEffect, useCallback } from 'react';
import { DollarSign } from 'lucide-react';
import MockWebSocketProvider from '../services/MockWebSocketProvider';
import GasDataService from '../services/GasDataService';
import CurrentGasPrices from './CurrentGasPrices';
import GasPriceChart from './GasPriceChart';
import WalletSimulation from './WalletSimulation';
import CostComparison from './CostComparison';
import StatusFooter from './StatusFooter';

const GasTracker = () => {
  const [gasData, setGasData] = useState({
    ethereum: [],
    polygon: [],
    arbitrum: []
  });

  const [currentPrices, setCurrentPrices] = useState({
    ethereum: { baseFee: 0, priorityFee: 0, totalFee: 0 },
    polygon: { baseFee: 0, priorityFee: 0, totalFee: 0 },
    arbitrum: { baseFee: 0, priorityFee: 0, totalFee: 0 }
  });

  const [ethUsdPrice, setEthUsdPrice] = useState(2400);
  const [simulationMode, setSimulationMode] = useState('live');
  const [transactionValue, setTransactionValue] = useState('0.5');
  const [simulationResults, setSimulationResults] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  // Initialize WebSocket connections
  useEffect(() => {
    const providers = {
      ethereum: new MockWebSocketProvider('wss://eth-mainnet.ws'),
      polygon: new MockWebSocketProvider('wss://polygon-mainnet.ws'),
      arbitrum: new MockWebSocketProvider('wss://arbitrum-mainnet.ws')
    };

    // Connect to all providers
    Object.values(providers).forEach(provider => provider.connect());
    setIsConnected(true);

    return () => {
      Object.values(providers).forEach(provider => provider.disconnect());
      setIsConnected(false);
    };
  }, []);

  // Real-time data updates every 6 seconds
  useEffect(() => {
    const gasDataService = new GasDataService();

    const interval = setInterval(() => {
      const timestamp = Date.now();
      const chains = ['ethereum', 'polygon', 'arbitrum'];

      chains.forEach(chain => {
        const newData = gasDataService.generateMockGasData(chain, timestamp);

        setGasData(prev => ({
          ...prev,
          [chain]: [...prev[chain].slice(-19), {
            time: new Date(timestamp).toLocaleTimeString(),
            price: newData.totalFee,
            baseFee: newData.baseFee,
            priorityFee: newData.priorityFee,
            timestamp
          }]
        }));

        setCurrentPrices(prev => ({
          ...prev,
          [chain]: {
            baseFee: newData.baseFee,
            priorityFee: newData.priorityFee,
            totalFee: newData.totalFee
          }
        }));
      });

      // Update ETH/USD price
      setEthUsdPrice(gasDataService.getMockEthUsdPrice());
    }, 6000);

    // Initial data load
    const initialLoad = () => {
      const timestamp = Date.now();
      const chains = ['ethereum', 'polygon', 'arbitrum'];

      chains.forEach(chain => {
        const initialData = [];
        for (let i = 19; i >= 0; i--) {
          const dataPoint = gasDataService.generateMockGasData(chain, timestamp - (i * 6000));
          initialData.push({
            time: new Date(timestamp - (i * 6000)).toLocaleTimeString(),
            price: dataPoint.totalFee,
            baseFee: dataPoint.baseFee,
            priorityFee: dataPoint.priorityFee,
            timestamp: timestamp - (i * 6000)
          });
        }

        setGasData(prev => ({ ...prev, [chain]: initialData }));

        const latest = initialData[initialData.length - 1];
        setCurrentPrices(prev => ({
          ...prev,
          [chain]: {
            baseFee: latest.baseFee,
            priorityFee: latest.priorityFee,
            totalFee: latest.price
          }
        }));
      });
    };

    initialLoad();
    return () => clearInterval(interval);
  }, []);

  // Simulation function
  const runSimulation = useCallback(() => {
    const value = parseFloat(transactionValue);
    if (isNaN(value) || value <= 0) return;

    const gasLimit = 21000; // Standard ETH transfer
    const results = {};

    Object.entries(currentPrices).forEach(([chain, prices]) => {
      const gasInGwei = prices.totalFee;
      const gasInEth = (gasInGwei * gasLimit) / 1e9; // Convert gwei to ETH
      const gasCostUsd = gasInEth * ethUsdPrice;
      const transactionCostUsd = (value * ethUsdPrice) + gasCostUsd;

      results[chain] = {
        gasInGwei: gasInGwei.toFixed(2),
        gasInEth: gasInEth.toFixed(6),
        gasCostUsd: gasCostUsd.toFixed(2),
        transactionCostUsd: transactionCostUsd.toFixed(2),
        totalCost: transactionCostUsd
      };
    });

    setSimulationResults(results);
  }, [currentPrices, ethUsdPrice, transactionValue]);

  // Auto-run simulation when values change in live mode
  useEffect(() => {
    if (simulationMode === 'live') {
      runSimulation();
    }
  }, [simulationMode, runSimulation]);

  const chainColors = {
    ethereum: '#627eea',
    polygon: '#8247e5',
    arbitrum: '#28a0f0'
  };

  const chainNames = {
    ethereum: 'Ethereum',
    polygon: 'Polygon',
    arbitrum: 'Arbitrum'
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-white p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Real-Time Cross-Chain Gas Tracker
          </h1>
          <div className="flex items-center justify-center space-x-4 text-sm">
            <div className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-400' : 'bg-red-400'}`}></div>
              <span>{isConnected ? 'Connected' : 'Disconnected'}</span>
            </div>
            <div className="flex items-center space-x-2">
              <DollarSign size={16} />
              <span>ETH/USD: ${ethUsdPrice}</span>
            </div>
          </div>
        </div>

        {/* Current Gas Prices */}
        <CurrentGasPrices 
          currentPrices={currentPrices} 
          chainColors={chainColors} 
          chainNames={chainNames} 
        />

        {/* Interactive Chart */}
        <GasPriceChart 
          gasData={gasData} 
          chainColors={chainColors} 
        />

        {/* Wallet Simulation */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <WalletSimulation 
            simulationMode={simulationMode}
            setSimulationMode={setSimulationMode}
            transactionValue={transactionValue}
            setTransactionValue={setTransactionValue}
            runSimulation={runSimulation}
          />

          <CostComparison 
            simulationResults={simulationResults}
            chainColors={chainColors}
            chainNames={chainNames}
          />
        </div>

        {/* Status Footer */}
        <StatusFooter />
      </div>
    </div>
  );
};

export default GasTracker;