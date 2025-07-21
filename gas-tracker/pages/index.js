import { useState, useEffect } from 'react'
import Head from 'next/head'

export default function Home() {
  const [gasData, setGasData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchGasData()
    // Refresh data every 5 minutes
    const interval = setInterval(fetchGasData, 5 * 60 * 1000)
    return () => clearInterval(interval)
  }, [])

  const fetchGasData = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/gas-prices')
      if (!response.ok) {
        throw new Error('Failed to fetch gas data')
      }
      const data = await response.json()
      setGasData(data)
      setError(null)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Head>
        <title>Live Gas Tracker</title>
        <meta name="description" content="Track live gas prices in your area" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
        <h1 style={{ textAlign: 'center', color: '#333', marginBottom: '2rem' }}>
          🚗 Live Gas Tracker
        </h1>

        {loading && (
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <p>Loading gas prices...</p>
          </div>
        )}

        {error && (
          <div style={{ 
            background: '#fee', 
            border: '1px solid #fcc', 
            padding: '1rem', 
            borderRadius: '8px',
            textAlign: 'center',
            marginBottom: '2rem'
          }}>
            <p style={{ color: '#c33' }}>Error: {error}</p>
            <button 
              onClick={fetchGasData}
              style={{
                background: '#007bff',
                color: 'white',
                border: 'none',
                padding: '0.5rem 1rem',
                borderRadius: '4px',
                cursor: 'pointer',
                marginTop: '1rem'
              }}
            >
              Retry
            </button>
          </div>
        )}

        {gasData && (
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '1rem'
          }}>
            {gasData.stations?.map((station, index) => (
              <div 
                key={index}
                style={{
                  background: '#f8f9fa',
                  padding: '1.5rem',
                  borderRadius: '8px',
                  border: '1px solid #dee2e6',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                }}
              >
                <h3 style={{ margin: '0 0 1rem 0', color: '#495057' }}>
                  {station.name || `Station ${index + 1}`}
                </h3>
                <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#28a745' }}>
                  ${station.price || 'N/A'}
                </div>
                {station.address && (
                  <p style={{ margin: '0.5rem 0', color: '#6c757d', fontSize: '0.9rem' }}>
                    📍 {station.address}
                  </p>
                )}
                {station.lastUpdated && (
                  <p style={{ margin: '0', color: '#6c757d', fontSize: '0.8rem' }}>
                    Last updated: {new Date(station.lastUpdated).toLocaleString()}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}

        <div style={{ textAlign: 'center', marginTop: '3rem', color: '#6c757d' }}>
          <p>Data refreshes automatically every 5 minutes</p>
          <button 
            onClick={fetchGasData}
            disabled={loading}
            style={{
              background: loading ? '#6c757d' : '#007bff',
              color: 'white',
              border: 'none',
              padding: '0.75rem 1.5rem',
              borderRadius: '4px',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontSize: '1rem'
            }}
          >
            {loading ? 'Refreshing...' : '🔄 Refresh Now'}
          </button>
        </div>
      </main>
    </>
  )
}
