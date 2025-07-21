// API Route for fetching gas prices
export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).end()
    return
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    // Mock data for demonstration
    // Replace this with actual API calls to gas price services
    const mockGasData = {
      stations: [
        {
          name: "Shell Station",
          price: "3.45",
          address: "123 Main St, City, State",
          lastUpdated: new Date().toISOString()
        },
        {
          name: "BP Station",
          price: "3.42",
          address: "456 Oak Ave, City, State",
          lastUpdated: new Date().toISOString()
        },
        {
          name: "Exxon Mobil",
          price: "3.48",
          address: "789 Pine Rd, City, State",
          lastUpdated: new Date().toISOString()
        },
        {
          name: "Chevron",
          price: "3.41",
          address: "321 Elm St, City, State",
          lastUpdated: new Date().toISOString()
        }
      ],
      lastFetch: new Date().toISOString()
    }

    // Example: Integrate with real gas price API
    // Uncomment and modify the following section to use a real API
    /*
    const API_KEY = process.env.GAS_API_KEY
    const response = await fetch(`https://api.gasbuddy.com/stations?apikey=${API_KEY}`)
    const realData = await response.json()
    
    const processedData = {
      stations: realData.stations.map(station => ({
        name: station.name,
        price: station.prices.regular,
        address: station.address,
        lastUpdated: station.updated_at
      })),
      lastFetch: new Date().toISOString()
    }
    */

    // Add some random variation to make it look more realistic
    const randomizedData = {
      ...mockGasData,
      stations: mockGasData.stations.map(station => ({
        ...station,
        price: (parseFloat(station.price) + (Math.random() - 0.5) * 0.1).toFixed(2)
      }))
    }

    res.status(200).json(randomizedData)

  } catch (error) {
    console.error('Error fetching gas data:', error)
    res.status(500).json({ 
      error: 'Failed to fetch gas prices',
      message: error.message 
    })
  }
}
