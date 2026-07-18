import React, { useEffect, useState } from 'react';
import { Activity, ExternalLink, Clock } from 'lucide-react';

const ThreatFeed = () => {
  const [feed, setFeed] = useState([]);
  const [status, setStatus] = useState('Connecting...');

  useEffect(() => {
    // Establish Server-Sent Events (SSE) connection
    const eventSource = new EventSource('http://localhost:5000/api/feed');

    eventSource.onopen = () => {
      setStatus('Live');
    };

    eventSource.onmessage = (event) => {
      try {
        const newFeed = JSON.parse(event.data);
        setFeed(newFeed);
      } catch (e) {
        console.error('Error parsing SSE data', e);
      }
    };

    eventSource.onerror = (error) => {
      console.error('EventSource failed:', error);
      setStatus('Reconnecting...');
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  }, []);

  return (
    <div className="glass-panel animate-slide-down">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 className="title" style={{ margin: 0 }}>
          <Activity className="icon-accent pulse" size={24} /> Live Threat Feed
        </h2>
        <div className={`status-badge ${status === 'Live' ? 'status-live' : 'status-warning'}`}>
          <span className="status-dot"></span> {status}
        </div>
      </div>

      <div className="feed-container">
        {feed.length === 0 ? (
          <p style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: '20px' }}>Waiting for updates...</p>
        ) : (
          feed.map((item, index) => (
            <div key={index} className="feed-item fade-in">
              <div className="feed-time">
                <Clock size={14} /> {new Date(item.pubDate).toLocaleString()}
              </div>
              <h4>
                <a href={item.link} target="_blank" rel="noopener noreferrer" className="feed-link">
                  {item.title} <ExternalLink size={14} style={{ marginLeft: '4px' }} />
                </a>
              </h4>
              <p className="feed-snippet">{item.contentSnippet}</p>
            </div>
          ))
        )}
      </div>

      <style>{`
        .icon-accent { color: var(--accent); }
        .pulse { animation: pulse 2s infinite; }
        @keyframes pulse {
          0% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.1); opacity: 0.7; }
          100% { transform: scale(1); opacity: 1; }
        }
        
        .status-badge {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 4px 10px;
          border-radius: 20px;
          font-size: 0.8rem;
          font-weight: 600;
        }
        .status-live { background: rgba(34, 197, 94, 0.2); color: var(--success); }
        .status-warning { background: rgba(234, 179, 8, 0.2); color: #eab308; }
        
        .status-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: currentColor;
          animation: blink 1.5s infinite;
        }
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }

        .feed-container {
          display: flex;
          flex-direction: column;
          gap: 12px;
          max-height: 400px;
          overflow-y: auto;
          padding-right: 8px;
        }
        /* Custom scrollbar */
        .feed-container::-webkit-scrollbar { width: 6px; }
        .feed-container::-webkit-scrollbar-track { background: rgba(0, 0, 0, 0.2); border-radius: 4px; }
        .feed-container::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.2); border-radius: 4px; }
        
        .feed-item {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 8px;
          padding: 12px;
          transition: transform 0.2s, background 0.2s;
        }
        .feed-item:hover {
          transform: translateX(4px);
          background: rgba(255, 255, 255, 0.08);
        }
        .feed-time {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 0.75rem;
          color: var(--text-secondary);
          margin-bottom: 6px;
        }
        .feed-link {
          color: var(--text-primary);
          display: flex;
          align-items: center;
          font-size: 1rem;
          line-height: 1.4;
          margin-bottom: 4px;
        }
        .feed-link:hover { color: var(--accent); text-decoration: none; }
        
        .feed-snippet {
          font-size: 0.85rem;
          color: var(--text-secondary);
          margin: 0;
          line-height: 1.5;
        }

        .fade-in { animation: fadeIn 0.5s ease-in; }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
      `}</style>
    </div>
  );
};

export default ThreatFeed;
