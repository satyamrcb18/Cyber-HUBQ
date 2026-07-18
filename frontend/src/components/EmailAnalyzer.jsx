import React, { useState } from 'react';
import axios from 'axios';
import { Mail, AlertTriangle, ShieldCheck, Search, Loader } from 'lucide-react';

const API_URL = "https://cyber-hubq-1.onrender.com";

const EmailAnalyzer = () => {
  const [activeTab, setActiveTab] = useState('phishing');

  const [phishingText, setPhishingText] = useState('');
  const [phishingResult, setPhishingResult] = useState(null);

  const [breachEmail, setBreachEmail] = useState('');
  const [breachResult, setBreachResult] = useState(null);

  const [loading, setLoading] = useState(false);

  const handlePhishingScan = async (e) => {
    e.preventDefault();
    if (!phishingText) return;

    setLoading(true);
    setPhishingResult(null);

    try {
      const response = await axios.post(
        `${API_URL}/api/email/analyze`,
        { text: phishingText }
      );

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
      const response = await axios.post(
        `${API_URL}/api/email/breach`,
        { email: breachEmail }
      );

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
            Paste suspicious email content below.
          </p>

          <form onSubmit={handlePhishingScan} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>

            <textarea
              className="input-field"
              rows="4"
              placeholder="Paste email..."
              value={phishingText}
              onChange={(e) => setPhishingText(e.target.value)}
            />

            <button className="btn" disabled={loading}>
              {loading ? <Loader className="animate-spin" size={18} /> : 'Scan Email'}
            </button>

          </form>

          {phishingResult && (
            <div className={`result-box mt-4 ${phishingResult.riskLevel === 'Safe' ? 'safe-box' : 'danger-box'}`}>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                {phishingResult.riskLevel === 'Safe'
                  ? <ShieldCheck />
                  : <AlertTriangle />}
                <h3>{phishingResult.riskLevel}</h3>
              </div>

              <p>Risk Score : {phishingResult.score}</p>

            </div>
          )}

        </div>
      )}

      {activeTab === 'breach' && (

        <div className="tab-content fade-in">

          <p style={{ color: 'var(--text-secondary)', marginBottom: '15px' }}>
            Check if your email has appeared in public data breaches.
          </p>

          <form onSubmit={handleBreachCheck} style={{ display: 'flex', gap: '10px' }}>

            <input
              type="email"
              className="input-field"
              placeholder="Enter Email"
              value={breachEmail}
              onChange={(e) => setBreachEmail(e.target.value)}
            />

            <button className="btn" disabled={loading}>
              {loading ? <Loader className="animate-spin" size={18} /> : <Search size={18} />}
            </button>

          </form>

          {breachResult && (

            <div className={`result-box ${breachResult.status === 'Safe' ? 'safe-box' : 'danger-box'}`}>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>

                {breachResult.status === 'Safe'
                  ? <ShieldCheck />
                  : <AlertTriangle />}

                <h3>{breachResult.status}</h3>

              </div>

              <p>{breachResult.message}</p>

            </div>

          )}

        </div>

      )}

    </div>
  );
};

export default EmailAnalyzer;