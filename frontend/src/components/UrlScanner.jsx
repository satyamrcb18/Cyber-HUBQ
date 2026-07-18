import React, { useState } from 'react';
import axios from 'axios';
import { Shield, ShieldAlert, ShieldCheck, Loader, AlertTriangle } from 'lucide-react';

const UrlScanner = () => {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const scanUrl = async (e) => {
    e.preventDefault();
    if (!url) return;

    setLoading(true);
    setResult(null);
    setError('');

    try {
      const response = await axios.post('http://localhost:5000/api/scan', { url });
      setResult(response.data);
    } catch (err) {
      if (err.response && err.response.data && err.response.data.error) {
        setError(err.response.data.error);
      } else {
        setError('An error occurred while scanning. Ensure backend is running.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-panel animate-slide-down">
      <h2 className="title">
        <Shield className="icon-accent" size={24} /> URL Threat Scanner
      </h2>
      <p style={{ marginBottom: '15px', color: 'var(--text-secondary)' }}>
        Verify if a suspicious link is safe before clicking on it.
      </p>

      <form onSubmit={scanUrl} style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <input
          type="url"
          className="input-field"
          placeholder="https://example.com"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          required
        />
        <button type="submit" className="btn" disabled={loading}>
          {loading ? <Loader className="animate-spin" size={18} /> : 'Scan'}
        </button>
      </form>

      {error && (
        <div style={{ color: 'var(--danger)', padding: '10px', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '8px' }}>
          {error}
        </div>
      )}

      {result && (() => {
        let borderColor, bgColor, IconProps, titleText, titleColor;
        
        if (result.status === 'Safe') {
          borderColor = 'var(--success)';
          bgColor = 'rgba(34, 197, 94, 0.1)';
          IconProps = <ShieldCheck color="var(--success)" size={24} />;
          titleText = 'Safe to Visit';
          titleColor = 'var(--success)';
        } else if (result.status === 'Unreachable') {
          borderColor = '#f59e0b'; // Amber/Orange
          bgColor = 'rgba(245, 158, 11, 0.1)';
          IconProps = <AlertTriangle color="#f59e0b" size={24} />;
          titleText = 'Invalid or Offline URL';
          titleColor = '#f59e0b';
        } else {
          borderColor = 'var(--danger)';
          bgColor = 'rgba(239, 68, 68, 0.1)';
          IconProps = <ShieldAlert color="var(--danger)" size={24} />;
          titleText = 'Malicious URL Detected!';
          titleColor = 'var(--danger)';
        }

        return (
          <div style={{ 
            marginTop: '20px', 
            padding: '15px', 
            borderRadius: '8px',
            border: `1px solid ${borderColor}`,
            background: bgColor
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
              {IconProps}
              <h3 style={{ margin: 0, color: titleColor }}>
                {titleText}
              </h3>
            </div>
            
            <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
              <p><strong>Query Status:</strong> {result.details?.query_status}</p>
              {result.status === 'Malicious' && (
                <>
                  <p><strong>Threat:</strong> {result.details?.url_status}</p>
                  <p><strong>Date Added:</strong> {result.details?.date_added}</p>
                  {result.details?.tags && <p><strong>Tags:</strong> {result.details.tags.join(', ')}</p>}
                </>
              )}
              {result.status === 'Unreachable' && (
                <p><strong>Message:</strong> {result.details?.message}</p>
              )}
            </div>
          </div>
        );
      })()}

      <style>{`
        .icon-accent { color: var(--accent); }
        .animate-spin { animation: spin 1s linear infinite; }
        @keyframes spin { 100% { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

export default UrlScanner;
