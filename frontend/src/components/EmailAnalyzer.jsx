import React, { useState } from 'react';
import axios from 'axios';
import { Mail, AlertTriangle, ShieldCheck, Search, Loader } from 'lucide-react';

const EmailAnalyzer = () => {
  const [activeTab, setActiveTab] = useState('phishing'); // 'phishing' or 'breach'
  
  // State for Phishing
  const [phishingText, setPhishingText] = useState('');
  const [phishingResult, setPhishingResult] = useState(null);
  
  // State for Breach
  const [breachEmail, setBreachEmail] = useState('');
  const [breachResult, setBreachResult] = useState(null);
  
  const [loading, setLoading] = useState(false);

  const handlePhishingScan = async (e) => {
    e.preventDefault();
    if (!phishingText) return;
    
    setLoading(true);
    setPhishingResult(null);
    try {
      const response = await axios.post('http://localhost:5000/api/email/analyze', { text: phishingText });
      setPhishingResult(response.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleBreachCheck = async (e) => {
    e.preventDefault();
    if (!breachEmail) return;

    setLoading(true);
    setBreachResult(null);
    try {
      const response = await axios.post('http://localhost:5000/api/email/breach', { email: breachEmail });
      setBreachResult(response.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-panel animate-slide-down" style={{ height: '100%' }}>
      <h2 className="title">
        <Mail className="icon-accent" size={24} /> Email Security Center
      </h2>
      
      <div className="tabs-container">
        <button 
          className={`tab-btn ${activeTab === 'phishing' ? 'active' : ''}`}
          onClick={() => setActiveTab('phishing')}
        >
          Phishing Scanner
        </button>
        <button 
          className={`tab-btn ${activeTab === 'breach' ? 'active' : ''}`}
          onClick={() => setActiveTab('breach')}
        >
          Data Breach Checker
        </button>
      </div>

      {activeTab === 'phishing' && (
        <div className="tab-content fade-in">
          <p style={{ color: 'var(--text-secondary)', marginBottom: '15px' }}>
            Paste the suspicious email content below to check for common phishing keywords.
          </p>
          <form onSubmit={handlePhishingScan} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <textarea
              className="input-field"
              rows="4"
              placeholder="e.g. Urgent! Your account is suspended. Click here to verify your account."
              value={phishingText}
              onChange={(e) => setPhishingText(e.target.value)}
              required
            ></textarea>
            <button type="submit" className="btn" style={{ alignSelf: 'flex-start' }} disabled={loading}>
              {loading ? <Loader className="animate-spin" size={18} /> : 'Scan Email'}
            </button>
          </form>

          {phishingResult && (
            <div className={`result-box mt-4 ${phishingResult.riskLevel === 'Safe' ? 'safe-box' : 'danger-box'}`}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                {phishingResult.riskLevel === 'Safe' ? <ShieldCheck /> : <AlertTriangle />}
                <h3 style={{ margin: 0 }}>Result: {phishingResult.riskLevel}</h3>
              </div>
              <p>Risk Score: {phishingResult.score}</p>
              {phishingResult.matchedKeywords && phishingResult.matchedKeywords.length > 0 && (
                <div style={{ marginTop: '10px' }}>
                  <strong>Flagged Keywords:</strong>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '6px' }}>
                    {phishingResult.matchedKeywords.map((word, idx) => (
                      <span key={idx} className="keyword-tag">{word}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {activeTab === 'breach' && (
        <div className="tab-content fade-in">
          <p style={{ color: 'var(--text-secondary)', marginBottom: '15px' }}>
            Check if your email address was compromised in any public data leak.
            <br/><small>(Try: hacked@gmail.com for demo)</small>
          </p>
          <form onSubmit={handleBreachCheck} style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
            <input
              type="email"
              className="input-field"
              placeholder="Enter email address"
              value={breachEmail}
              onChange={(e) => setBreachEmail(e.target.value)}
              required
            />
            <button type="submit" className="btn" disabled={loading}>
              {loading ? <Loader className="animate-spin" size={18} /> : <span><Search size={18} /> Check</span>}
            </button>
          </form>

          {breachResult && (
            <div className={`result-box ${breachResult.status === 'Safe' ? 'safe-box' : 'danger-box'}`}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                {breachResult.status === 'Safe' ? <ShieldCheck /> : <AlertTriangle />}
                <h3 style={{ margin: 0 }}>{breachResult.status}</h3>
              </div>
              <p>{breachResult.message}</p>
              {breachResult.sources && breachResult.sources.length > 0 && (
                <div style={{ marginTop: '10px' }}>
                  <strong>Found in breaches:</strong>
                  <ul style={{ paddingLeft: '20px', marginTop: '6px', color: 'var(--text-secondary)' }}>
                    {breachResult.sources.map((src, idx) => <li key={idx}>{src}</li>)}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      <style>{`
        .icon-accent { color: var(--accent); }
        .fade-in { animation: fadeIn 0.3s ease-in; }
        .mt-4 { margin-top: 1rem; }
        
        .tabs-container {
          display: flex;
          border-bottom: 1px solid var(--glass-border);
          margin-bottom: 20px;
        }
        .tab-btn {
          flex: 1;
          background: transparent;
          border: none;
          color: var(--text-secondary);
          padding: 12px;
          cursor: pointer;
          font-family: inherit;
          font-weight: 600;
          font-size: 0.95rem;
          transition: all 0.2s;
          border-bottom: 2px solid transparent;
        }
        .tab-btn:hover {
          color: white;
          background: rgba(255, 255, 255, 0.05);
        }
        .tab-btn.active {
          color: var(--accent);
          border-bottom-color: var(--accent);
        }

        .result-box {
          padding: 16px;
          border-radius: 8px;
          border: 1px solid transparent;
        }
        .safe-box {
          background: rgba(34, 197, 94, 0.1);
          border-color: var(--success);
          color: var(--success);
        }
        .danger-box {
          background: rgba(239, 68, 68, 0.1);
          border-color: var(--danger);
          color: var(--danger);
        }
        .safe-box p, .danger-box p {
          color: var(--text-primary);
          margin-bottom: 4px;
        }

        .keyword-tag {
          background: rgba(239, 68, 68, 0.2);
          color: #fca5a5;
          padding: 4px 10px;
          border-radius: 12px;
          font-size: 0.8rem;
          border: 1px solid rgba(239, 68, 68, 0.3);
        }
      `}</style>
    </div>
  );
};

export default EmailAnalyzer;
