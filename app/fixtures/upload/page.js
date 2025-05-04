'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function UploadPage() {
  const router = useRouter();
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleUpload = async () => {
    if (!file) {
      setMessage('Please select a file first.');
      return;
    }

    setLoading(true);

    const reader = new FileReader();
    reader.onload = async (e) => {
      const text = e.target.result;

      try {
        const res = await fetch('/api/fixtures/upload', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ text }),
        });

        if (!res.ok) {
          const errorData = await res.json();
          setMessage(errorData.error || 'Upload failed.');
          setLoading(false);
          return;
        }

        const data = await res.json();
        setMessage(data.message || 'Upload successful.');
      } catch (err) {
        console.error('Upload error:', err);
        setMessage('Upload failed: server error');
      } finally {
        setLoading(false);
      }
    };

    reader.readAsText(file);
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#111827',
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
        {/* Toolbar */}
        <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'center', gap: '1.5rem' }}>
          <button
            onClick={() => router.push('/')}
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
            Home
          </button>
          <button
            onClick={() => router.push('/fixtures/search')}
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
            Search
          </button>
        </div>

        <h1 style={{ fontSize: '2.5rem', marginBottom: '1.5rem', color: 'white' }}>Upload Fixtures CSV</h1>

        <input
          type="file"
          id="fileInput"
          style={{ display: 'none' }}
          onChange={(e) => setFile(e.target.files[0])}
        />

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
          <button
            onClick={() => document.getElementById('fileInput').click()}
            style={{
              padding: '1rem 2rem',
              backgroundColor: '#34D399',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '1rem',
              cursor: 'pointer',
              transition: 'background-color 0.3s',
            }}
            onMouseOver={e => e.currentTarget.style.backgroundColor = '#059669'}
            onMouseOut={e => e.currentTarget.style.backgroundColor = '#34D399'}
          >
            Choose CSV File
          </button>

          {file && (
            <p style={{ color: '#d1d5db' }}>
              Selected file: {file.name}
            </p>
          )}

          <button
            onClick={handleUpload}
            disabled={loading}
            style={{
              padding: '1rem 2rem',
              backgroundColor: loading ? '#60a5fa' : '#0070f3',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '1rem',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1,
              transition: 'background-color 0.3s',
            }}
          >
            {loading ? 'Uploading...' : 'Upload CSV'}
          </button>
        </div>

        {message && (
          <p style={{ marginTop: '1rem', color: message.includes('success') ? '#34D399' : '#f87171' }}>
            {message}
          </p>
        )}
      </div>
    </div>
  );
}