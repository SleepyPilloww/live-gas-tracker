/**
 * Mock WebSocket Provider for simulating real-time blockchain connections
 * In production, this would connect to actual WebSocket endpoints like:
 * - wss://eth-mainnet.ws.alchemyapi.io/v2/your-api-key
 * - wss://polygon-mainnet.ws.alchemyapi.io/v2/your-api-key
 * - wss://arb-mainnet.ws.alchemyapi.io/v2/your-api-key
 */
export class MockWebSocketProvider {
    constructor(url) {
      this.url = url;
      this.listeners = [];
      this.connected = false;
      this.reconnectAttempts = 0;
      this.maxReconnectAttempts = 5;
    }
  
    connect() {
      this.connected = true;
      this.reconnectAttempts = 0;
      
      // Simulate connection establishment
      setTimeout(() => {
        this.listeners.forEach(listener => 
          listener({ 
            type: 'connected', 
            timestamp: Date.now(),
            url: this.url 
          })
        );
      }, Math.random() * 1000 + 500); // 500-1500ms delay
    }
  
    on(event, callback) {
      this.listeners.push(callback);
    }
  
    off(event, callback) {
      this.listeners = this.listeners.filter(listener => listener !== callback);
    }
  
    disconnect() {
      this.connected = false;
      this.listeners.forEach(listener => 
        listener({ 
          type: 'disconnected', 
          timestamp: Date.now() 
        })
      );
    }
  
    // Simulate connection issues
    simulateDisconnection() {
      if (this.connected) {
        this.connected = false;
        this.listeners.forEach(listener => 
          listener({ 
            type: 'error', 
            message: 'Connection lost',
            timestamp: Date.now() 
          })
        );
        
        // Auto-reconnect after a delay
        if (this.reconnectAttempts < this.maxReconnectAttempts) {
          this.reconnectAttempts++;
          setTimeout(() => this.connect(), 2000 * this.reconnectAttempts);
        }
      }
    }
  
    isConnected() {
      return this.connected;
    }
  }