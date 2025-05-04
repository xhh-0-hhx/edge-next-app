'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

export default function SearchPage() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedFixtureId, setSelectedFixtureId] = useState(null);

  const debouncedQuery = useDebounce(query, 400);

  useEffect(() => {
    const fetchData = async () => {
      if (!debouncedQuery.trim()) {
        setResults([]);
        return;
      }
      setLoading(true);
      try {
        const res = await fetch(`/api/fixtures/search?q=${encodeURIComponent(debouncedQuery)}`);
        const data = await res.json();
        setResults(data);
      } catch (error) {
        console.error('Error fetching search results:', error);
      }
      setLoading(false);
    };
    fetchData();
  }, [debouncedQuery]);

  const toggleFixture = (id) => {
    setSelectedFixtureId(prev => (prev === id ? null : id));
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center',
      backgroundColor: '#111827',
      flexDirection: 'column',
      padding: '2rem',
    }}>
      <div style={{ 
        padding: '3rem',
        backgroundColor: '#1f2937',
        borderRadius: '10px',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.5)',
        textAlign: 'center',
        maxWidth: '600px',
        width: '100%',
        color: '#d1d5db',
      }}>
        <div style={{ marginBottom: '2rem', display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          <button
            onClick={() => router.push('/')}
            style={{
              padding: '1rem 2rem',
              backgroundColor: '#6366f1',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '1rem',
              transition: 'background-color 0.3s',
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#4f46e5'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#6366f1'}
          >
            Home
          </button>
          <button
            onClick={() => router.push('/fixtures/upload')}
            style={{
              padding: '1rem 2rem',
              backgroundColor: '#10b981',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '1rem',
              transition: 'background-color 0.3s',
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#059669'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#10b981'}
          >
            Upload
          </button>
        </div>

        <h1 style={{ fontSize: '2rem', marginBottom: '2rem', color: '#d1d5db' }}>Search Fixtures</h1>

        <input
          type="text"
          placeholder="Enter team name or competition name"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={{
            padding: '0.5rem',
            width: '300px',
            marginRight: '1rem',
            marginBottom: '1rem',
            border: '1px solid #ccc',
            borderRadius: '4px',
            color: '#d1d5db',
            backgroundColor: '#374151',
            borderColor: '#4b5563',
          }}
        />

        <div style={{ marginTop: '1rem' }}>
          {loading ? (
            <p style={{ fontSize: '1.25rem', color: '#60a5fa' }}>Loading...</p>
          ) : results.length === 0 && query.trim() !== '' ? (
            <p style={{ color: '#d1d5db' }}>No results found.</p>
          ) : (
            <ul style={{ listStyle: 'none', padding: 0, marginTop: '2rem', width: '100%', maxWidth: '600px' }}>
              {results.map((fixture) => (
                <li 
                  key={fixture._id} 
                  style={{ 
                    marginBottom: '1rem', 
                    padding: '1rem', 
                    border: '1px solid #4b5563', 
                    borderRadius: '8px', 
                    backgroundColor: '#374151',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                    transition: 'transform 0.2s',
                    cursor: 'pointer',
                    color: '#d1d5db',
                  }}
                  onClick={() => toggleFixture(fixture._id)}
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                >
                  <p><strong>{fixture.home_team}</strong> vs <strong>{fixture.away_team}</strong></p>
                  {selectedFixtureId === fixture._id && (
                    <div style={{ marginTop: '0.5rem', textAlign: 'left', color: '#9ca3af' }}>
                      <p><strong>Season:</strong> {fixture.season}</p>
                      <p><strong>Fixture ID:</strong> {fixture.fixture_mid}</p>
                      <p><strong>Competition:</strong> {fixture.competition_name}</p>
                      <p><strong>DateTime:</strong> {fixture.fixture_datetime}</p>
                      <p><strong>Round:</strong> {fixture.fixture_round}</p>
                      <p><strong>Home Team:</strong> {fixture.home_team}</p>
                      <p><strong>Away Team:</strong> {fixture.away_team}</p>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}