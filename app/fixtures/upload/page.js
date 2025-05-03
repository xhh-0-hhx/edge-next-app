'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function UploadPage() {
  const router = useRouter();
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');

  const handleUpload = async () => {
    if (!file) {
      setMessage('Please select a file first.');
      return;
    }

    const reader = new FileReader();
    reader.onload = async (e) => {
      const text = e.target.result;

      const res = await fetch('/api/fixtures/upload', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
      });

      try {
        const data = await res.json();
        setMessage(data.message || data.error);
      } catch (err) {
        setMessage('Upload failed: invalid server response');
      }
    };

    reader.readAsText(file);
  };

  return (
    <div style={{ padding: '2rem' }}>
      {/* Toolbar */}
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
          onClick={() => router.push('/fixtures/search')}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: '#10b981',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
          }}
        >
          Search
        </button>
      </div>

      <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Upload Fixtures CSV</h1>

      <input
        type="file"
        id="fileInput"
        style={{ display: 'none' }}
        onChange={(e) => setFile(e.target.files[0])}
      />

      <button
        onClick={() => document.getElementById('fileInput').click()}
        style={{
          padding: '0.5rem 1rem',
          backgroundColor: '#34D399',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          marginBottom: '1rem',
          cursor: 'pointer',
        }}
      >
        Choose CSV File
      </button>

      <br />

      {file && (
        <p style={{ marginBottom: '1rem' }}>
          Selected file: {file.name}
        </p>
      )}

      <button
        onClick={handleUpload}
        style={{
          padding: '0.5rem 1rem',
          backgroundColor: '#0070f3',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
        }}
      >
        Upload CSV
      </button>

      {message && (
        <p style={{ marginTop: '1rem' }}>{message}</p>
      )}
    </div>
  );
}