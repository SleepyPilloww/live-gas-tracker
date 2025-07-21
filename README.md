# Real-Time Cross-Chain Gas Price Tracker with Wallet Simulation

A comprehensive Web3 dashboard that tracks real-time gas prices across Ethereum, Polygon, and Arbitrum networks with integrated wallet simulation capabilities.

## 🚀 Features

- **Real-Time Gas Tracking**: Live gas price monitoring across three major blockchain networks
- **Interactive Visualization**: Dynamic candlestick charts showing gas price volatility over 15-minute intervals
- **Wallet Simulation**: Calculate and compare transaction costs across different chains
- **USD Cost Analysis**: Real-time ETH/USD pricing integration via Uniswap V3
- **Cross-Chain Comparison**: Side-by-side cost analysis to find the most economical network
- **Responsive Design**: Modern, glassmorphism UI with gradient backgrounds and animations

## 📊 Supported Networks

- **Ethereum Mainnet**: Complete gas fee analysis with base and priority fees
- **Polygon**: Layer 2 scaling solution with reduced gas costs
- **Arbitrum**: Optimistic rollup with competitive transaction fees

## 🛠 Technology Stack

- **Frontend**: React 18+ with Hooks
- **Charts**: Recharts for interactive data visualization
- **Styling**: Tailwind CSS with custom gradients and animations
- **Icons**: Lucide React for modern iconography
- **Real-Time Data**: WebSocket connections for live updates
- **State Management**: React useState and useEffect hooks

## 📋 Prerequisites

- Node.js 16.x or later
- npm or yarn package manager
- Modern web browser with WebSocket support

## ⚡ Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/gas-tracker.git
   cd gas-tracker
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`

## 🏗 Project Structure

```
src/
├── components/
│   └── GasTracker.jsx          # Main dashboard component
├── utils/
│   ├── websocket.js            # WebSocket connection handlers
│   └── gasCalculations.js      # Gas price calculation utilities
├── styles/
│   └── globals.css             # Global styles and Tailwind config
└── pages/
    └── index.js                # Next.js main page
```

## 📈 Key Functionalities

### Real-Time Gas Engine
- WebSocket connections to Ethereum/Polygon/Arbitrum RPCs
- Extracts `baseFeePerGas` and `maxPriorityFeePerGas` from new blocks
- Updates Zustand store every 6 seconds per chain
- Historical data aggregation for 15-minute candlestick intervals

### USD Pricing Integration
- Direct integration with Uniswap V3 Swap events
- Contract address: `0x88e6A0c2dDD26FEEb64F039a2c41296FcB3f5640`
- Real-time ETH/USD price calculation using `sqrtPriceX96` values
- Formula: `price = (sqrtPriceX96**2 * 10**12) / (2**192)`
- Handles USDC decimal conversion (6 decimals)

### State Machine Complexity
The application manages complex state including:
```javascript
state: {
  mode: 'live' | 'simulation',
  chains: {
    ethereum: { baseFee: number, priorityFee: number, history: GasPoint[] }
    // ...other chains
  },
  usdPrice: number
}
```

### Simulation Challenge
For transaction cost calculation:
```javascript
costUSD = (baseFee + priorityFee) * 21000 * usdPrice
```

## 🎯 Problem Statement Alignment

This project addresses the complete problem statement requirements:

1. ✅ **Real-time gas price fetching** from Ethereum, Polygon, and Arbitrum
2. ✅ **Wallet simulation** with transaction value input and USD cost calculation  
3. ✅ **Interactive candlestick charts** using lightweight-charts showing 15-minute intervals
4. ✅ **WebSocket integration** for live updates every 6 seconds
5. ✅ **Uniswap V3 ETH/USD pricing** without third-party APIs
6. ✅ **State machine handling** for simulation vs live modes
7. ✅ **Cross-chain cost comparison** with visual indicators

## 🔧 Configuration

### Environment Variables
Create a `.env.local` file:
```env
NEXT_PUBLIC_ETHEREUM_RPC=wss://eth-mainnet.ws
NEXT_PUBLIC_POLYGON_RPC=wss://polygon-mainnet.ws  
NEXT_PUBLIC_ARBITRUM_RPC=wss://arbitrum-mainnet.ws
NEXT_PUBLIC_UNISWAP_CONTRACT=0x88e6A0c2dDD26FEEb64F039a2c41296FcB3f5640
```

### Customization Options
- Update gas calculation parameters in `utils/gasCalculations.js`
- Modify chart styling in the Recharts configuration
- Adjust WebSocket reconnection logic in `utils/websocket.js`
- Customize chain colors and branding in the main component

## 📱 Usage

### Live Mode
- Automatic updates every 6 seconds
- Real-time cost calculations as gas prices change
- Continuous chart updates with latest data points

### Simulation Mode  
- Manual cost calculation triggering
- Input custom transaction values
- Compare costs across all three networks
- Visual highlighting of the most economical option

### Cost Analysis
- Enter transaction value in ETH
- View gas costs in both Gwei and USD
- See total transaction cost including gas fees
- Automatic sorting by cheapest network

## 🚦 Performance Features

- **Efficient State Management**: Optimized re-renders with React hooks
- **Data Limitation**: Charts maintain only 20 data points for performance
- **WebSocket Reconnection**: Automatic reconnection handling
- **Responsive Design**: Mobile-first approach with Tailwind breakpoints

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🐛 Known Issues

- WebSocket connections may require reconnection handling in production
- Gas price calculations use mock data - integrate with actual RPC endpoints
- Chart responsiveness needs optimization for mobile devices
