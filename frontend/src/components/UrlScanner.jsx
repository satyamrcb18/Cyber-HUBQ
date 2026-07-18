import React, { useState } from 'react';
import axios from 'axios';
import { Shield, ShieldAlert, ShieldCheck, Loader, AlertTriangle } from 'lucide-react';

const API_URL = "https://cyber-hubq-1.onrender.com";

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
      const response = await axios.post(`${API_URL}/api/scan`, {
        url,
      });

      setResult(response.data);
    } catch (err) {
      if (err.response?.data?.error) {
        setError(err.response.data.error);
      } else {
        setError("Unable to connect to backend.");
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

      <p style={{ marginBottom: "15px", color: "var(--text-secondary)" }}>
        Verify if a suspicious link is safe before clicking on it.
      </p>

      <form
        onSubmit={scanUrl}
        style={{ display: "flex", gap: "10px", marginBottom: "20px" }}
      >
        <input
          type="url"
          className="input-field"
          placeholder="https://example.com"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          required
        />

        <button type="submit" className="btn" disabled={loading}>
          {loading ? (
            <Loader className="animate-spin" size={18} />
          ) : (
            "Scan"
          )}
        </button>
      </form>

      {error && (
        <div
          style={{
            color: "var(--danger)",
            padding: "10px",
            background: "rgba(239,68,68,0.1)",
            borderRadius: "8px",
          }}
        >
          {error}
        </div>
      )}

      {result && (
        <div
          style={{
            marginTop: "20px",
            padding: "15px",
            borderRadius: "8px",
            background: "rgba(34,197,94,0.1)",
            border: "1px solid #22c55e",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
            }}
          >
            {result.status === "Safe" ? (
              <ShieldCheck color="#22c55e" />
            ) : result.status === "Malicious" ? (
              <ShieldAlert color="#ef4444" />
            ) : (
              <AlertTriangle color="#f59e0b" />
            )}

            <h3>{result.status}</h3>
          </div>

          <p>
            <strong>Query Status:</strong>{" "}
            {result.details?.query_status || "N/A"}
          </p>

          {result.details?.message && (
            <p>
              <strong>Message:</strong> {result.details.message}
            </p>
          )}

          {result.details?.url_status && (
            <p>
              <strong>Threat:</strong> {result.details.url_status}
            </p>
          )}

          {result.details?.date_added && (
            <p>
              <strong>Date:</strong> {result.details.date_added}
            </p>
          )}

          {result.details?.tags && (
            <p>
              <strong>Tags:</strong> {result.details.tags.join(", ")}
            </p>
          )}
        </div>
      )}

      <style>{`
        .icon-accent {
          color: var(--accent);
        }

        .animate-spin {
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          100% {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
};

export default UrlScanner;