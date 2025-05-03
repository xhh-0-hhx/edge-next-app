'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SearchPage() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);

  const handleSearch = async () => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const res = await fetch(`/api/fixtures/search?q=${encodeURIComponent(query)}`);
    const data = await res.json();
    setResults(data);
  };

  return (
    <div style={{ padding: '2rem' }}>
 
      <div style={{ marginBottom: '2rem', display: 'flex', gap: '1rem' }}>
        <button
          onClick={() => router.push('/')}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: '#6366f1',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
          }}
        >
          Home
        </button>
        <button
          onClick={() => router.push('/fixtures/upload')}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: '#10b981',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
          }}
        >
          Upload
        </button>
      </div>

      <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Search Fixtures</h1>


      <input
        type="text"
        placeholder="Enter team name or competition name"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        style={{
          padding: '0.5rem',
          width: '300px',
          marginRight: '1rem',
          border: '1px solid #ccc',
          borderRadius: '4px',
        }}
      />
      
 
      <button
        onClick={handleSearch}
        style={{
          padding: '0.5rem 1rem',
          backgroundColor: '#3B82F6',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
        }}
      >
        Search
      </button>


      <div style={{ marginTop: '2rem' }}>
        {results.length === 0 ? (
          <p>No results found.</p>
        ) : (
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {results.map((fixture) => (
              <li key={fixture._id} style={{ marginBottom: '1rem', padding: '1rem', border: '1px solid #ccc', borderRadius: '5px' }}>
                <p><strong>{fixture.home_team}</strong> vs <strong>{fixture.away_team}</strong></p>
                <p>Competition: {fixture.competition_name}</p>
                <p>Fixture DateTime: {fixture.fixture_datetime}</p>
                <p>Round: {fixture.fixture_round}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}