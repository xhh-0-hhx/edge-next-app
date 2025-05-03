'use client';

import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  const goToUpload = () => {
    router.push('/fixtures/upload');
  };

  const goToSearch = () => {
    router.push('/fixtures/search');
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#111827', // optional darker background
    }}>
      <div style={{
        padding: '3rem',
        backgroundColor: '#1f2937',
        borderRadius: '10px',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.5)',
        textAlign: 'center',
        maxWidth: '600px',
        width: '100%',
      }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '1.5rem', color: 'white' }}>Welcome to the Fixtures Manager</h1>
        <p style={{ marginBottom: '2rem', fontSize: '1.25rem', color: '#d1d5db' }}>
          Choose an action below:
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem' }}>
          <button
            onClick={goToUpload}
            style={{
              padding: '1rem 2rem',
              backgroundColor: '#3B82F6',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '1rem',
              cursor: 'pointer',
              transition: 'background-color 0.3s',
            }}
            onMouseOver={e => e.currentTarget.style.backgroundColor = '#2563EB'}
            onMouseOut={e => e.currentTarget.style.backgroundColor = '#3B82F6'}
          >
            Go to Upload Page
          </button>
          <button
            onClick={goToSearch}
            style={{
              padding: '1rem 2rem',
              backgroundColor: '#10B981',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '1rem',
              cursor: 'pointer',
              transition: 'background-color 0.3s',
            }}
            onMouseOver={e => e.currentTarget.style.backgroundColor = '#059669'}
            onMouseOut={e => e.currentTarget.style.backgroundColor = '#10B981'}
          >
            Go to Search Page
          </button>
        </div>
      </div>
    </div>
  );
}