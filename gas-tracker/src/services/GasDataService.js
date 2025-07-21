/**
 * Gas Data Service - Handles all gas price calculations and data generation
 * In production, this would fetch real data from APIs like:
 * - Etherscan Gas Tracker API
 * - Polygon Gas Station API
 * - Arbitrum RPC endpoints
 */

// Base gas prices for different chains (in gwei)
const BASE_GAS_PRICES = {
    ethereum: 25,
    polygon: 35,
    arbitrum: 0.8,
    optimism: 0.5,
    bsc: 5
  };
  
  // Network configurations
  export const NETWORK_CONFIG = {
    ethereum: {
      name: 'Ethereum',
      color: '#627eea',
      gasLimit: 21000,
      currency: 'ETH'
    },
    polygon: {
      name: 'Polygon',
      color: '#8247e5',
      gasLimit: 21000,
      currency: 'MATIC'
    },
    arbitrum: {
      name: 'Arbitrum',
      color: '#28a0f0',
      gasLimit: 21000,
      currency: 'ETH'
    }
  };
  
  /**
   * Generates mock gas price data for a specific chain
   * @param {string} chain - The blockchain name
   * @param {number} timestamp - The timestamp for the data point
   * @returns {object} Gas price data object
   */
  export const generateMockGasData = (chain, timestamp) => {
    const baseGas = BASE_GAS_PRICES[chain] || 10;
    
    // Add some realistic volatility
    const timeOfDay = new Date(timestamp).getHours();
    const isHighTraffic = timeOfDay >= 8 && timeOfDay <= 22; // Peak hours
    const trafficMultiplier = isHighTraffic ? 1.5 : 1.0;
    
    // Random variation with some network-specific patterns
    let variation = Math.random() * 10 - 5; // -5 to +5 gwei
    
    // Ethereum has higher volatility
    if (chain === 'ethereum') {
      variation *= 2;
    }
    
    const baseFee = Math.max(1, baseGas * trafficMultiplier + variation);
    const priorityFee = Math.max(0.1, baseFee * 0.1 + Math.random() * 2);
    
    return {
      chain,
      baseFee: parseFloat(baseFee.toFixed(2)),
      priorityFee: parseFloat(priorityFee.toFixed(2)),
      timestamp,
      totalFee: parseFloat((baseFee + priorityFee).toFixed(2)),
      blockNumber: Math.floor(timestamp / 1000) + Math.floor(Math.random() * 1000)
    };
  };
  
  /**
   * Generates historical gas data for initial chart population
   * @param {string} chain - The blockchain name
   * @param {number} points - Number of data points to generate
   * @param {number} intervalMs - Interval between data points in milliseconds
   * @returns {array} Array of historical gas data points
   */
  export const generateHistoricalGasData = (chain, points = 20, intervalMs = 6000) => {
    const now = Date.now();
    const data = [];
    
    for (let i = points - 1; i >= 0; i--) {
      const timestamp = now - (i * intervalMs);
      const gasData = generateMockGasData(chain, timestamp);
      
      data.push({
        time: new Date(timestamp).toLocaleTimeString(),
        price: gasData.totalFee,
        baseFee: gasData.baseFee,
        priorityFee: gasData.priorityFee,
        timestamp,
        blockNumber: gasData.blockNumber
      });
    }
    
    return data;
  };
  
  /**
   * Mock ETH/USD price generator with realistic fluctuations
   * @returns {number} ETH price in USD
   */
  export const getMockEthUsdPrice = () => {
    const basePrice = 2400;
    const dailyVariation = Math.sin(Date.now() / 86400000) * 50; // Daily cycle
    const randomVariation = (Math.random() - 0.5) * 100; // Random noise
    
    return parseFloat((basePrice + dailyVariation + randomVariation).toFixed(2));
  };
  
  /**
   * Calculate transaction costs across different networks
   * @param {object} gasPrices - Current gas prices for all networks
   * @param {number} ethUsdPrice - Current ETH/USD price
   * @param {number} transactionValue - Transaction value in ETH
   * @returns {object} Cost breakdown for each network
   */
  export const calculateTransactionCosts = (gasPrices, ethUsdPrice, transactionValue) => {
    const results = {};
    
    Object.entries(gasPrices).forEach(([chain, prices]) => {
      const config = NETWORK_CONFIG[chain];
      if (!config) return;
      
      const gasLimit = config.gasLimit;
      const gasInGwei = prices.totalFee;
      const gasInEth = (gasInGwei * gasLimit) / 1e9; // Convert gwei to ETH
      const gasCostUsd = gasInEth * ethUsdPrice;
      const transactionValueUsd = transactionValue * ethUsdPrice;
      const totalCostUsd = transactionValueUsd + gasCostUsd;
      
      results[chain] = {
        gasInGwei: gasInGwei.toFixed(2),
        gasInEth: gasInEth.toFixed(6),
        gasCostUsd: gasCostUsd.toFixed(2),
        transactionValueUsd: transactionValueUsd.toFixed(2),
        totalCostUsd: totalCostUsd.toFixed(2),
        totalCost: totalCostUsd,
        efficiency: (transactionValue / gasInEth).toFixed(2), // Value to gas ratio
        networkName: config.name,
        networkColor: config.color
      };
    });
    
    return results;
  };
  
  /**
   * Get network status and health metrics
   * @param {object} gasPrices - Current gas prices
   * @returns {object} Network health status
   */
  export const getNetworkStatus = (gasPrices) => {
    const status = {};
    
    Object.entries(gasPrices).forEach(([chain, prices]) => {
      const baseGas = BASE_GAS_PRICES[chain];
      const currentGas = prices.totalFee;
      const congestionRatio = currentGas / baseGas;
      
      let congestionLevel = 'low';
      if (congestionRatio > 2) congestionLevel = 'high';
      else if (congestionRatio > 1.5) congestionLevel = 'medium';
      
      status[chain] = {
        congestionLevel,
        congestionRatio: congestionRatio.toFixed(2),
        recommendedAction: congestionLevel === 'high' ? 'Wait for lower fees' : 'Good time to transact',
        avgBlockTime: chain === 'ethereum' ? 12 : chain === 'polygon' ? 2 : 1 // seconds
      };
    });
    
    return status;
  };