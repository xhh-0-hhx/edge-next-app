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
    <div style={{ padding: '2rem' }}>
      <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Welcome to the Fixtures Manager</h1>
      <p style={{ marginBottom: '2rem' }}>
        Choose an action below:
      </p>
      <div style={{ display: 'flex', gap: '1rem' }}>
        <button
          onClick={goToUpload}
          style={{
            padding: '0.75rem 1.5rem',
            backgroundColor: '#3B82F6',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
          }}
        >
          Go to Upload Page
        </button>
        <button
          onClick={goToSearch}
          style={{
            padding: '0.75rem 1.5rem',
            backgroundColor: '#10B981',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
          }}
        >
          Go to Search Page
        </button>
      </div>
    </div>
  );
}