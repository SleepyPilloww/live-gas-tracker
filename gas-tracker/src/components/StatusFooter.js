import React from 'react';

const StatusFooter = () => {
  return (
    <div className="text-center text-sm text-gray-400 space-y-2">
      <p>
        Real-time data from Ethereum, Polygon, and Arbitrum networks •
        ETH/USD pricing via Uniswap V3 • Updates every 6 seconds
      </p>
      <p className="text-xs">
        Built with Next.js, React, Recharts, and WebSocket providers for real-time blockchain data
      </p>
    </div>
  );
};

export default StatusFooter;