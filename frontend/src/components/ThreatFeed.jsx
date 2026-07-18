import React, { useEffect, useState } from 'react';
import { Activity, ExternalLink, Clock } from 'lucide-react';

const API_URL = "https://cyber-hubq-1.onrender.com";

const ThreatFeed = () => {
  const [feed, setFeed] = useState([]);
  const [status, setStatus] = useState("Connecting...");

  useEffect(() => {
    const eventSource = new EventSource(`${API_URL}/api/feed`);

    eventSource.onopen = () => {
      setStatus("Live");
    };

    eventSource.onmessage = (event) => {
      try {
        const newFeed = JSON.parse(event.data);
        setFeed(newFeed);
      } catch (e) {
        console.error("Error parsing SSE data", e);
      }
    };

    eventSource.onerror = (error) => {
      console.error("EventSource failed:", error);
      setStatus("Disconnected");
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  }, []);

  return (
    <div className="glass-panel animate-slide-down">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <h2 className="title" style={{ margin: 0 }}>
          <Activity className="icon-accent pulse" size={24} /> Live Threat Feed
        </h2>

        <div
          className={`status-badge ${
            status === "Live" ? "status-live" : "status-warning"
          }`}
        >
          <span className="status-dot"></span> {status}
        </div>
      </div>

      <div className="feed-container">
        {feed.length === 0 ? (
          <p
            style={{
              color: "var(--text-secondary)",
              textAlign: "center",
              padding: "20px",
            }}
          >
            Waiting for updates...
          </p>
        ) : (
          feed.map((item, index) => (
            <div key={index} className="feed-item fade-in">
              <div className="feed-time">
                <Clock size={14} />{" "}
                {new Date(item.pubDate).toLocaleString()}
              </div>

              <h4>
                <a
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="feed-link"
                >
                  {item.title}
                  <ExternalLink
                    size={14}
                    style={{ marginLeft: "4px" }}
                  />
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
          display:flex;
          align-items:center;
          gap:6px;
          padding:4px 10px;
          border-radius:20px;
          font-size:.8rem;
          font-weight:600;
        }

        .status-live{
          background:rgba(34,197,94,.2);
          color:var(--success);
        }

        .status-warning{
          background:rgba(234,179,8,.2);
          color:#eab308;
        }

        .status-dot{
          width:8px;
          height:8px;
          border-radius:50%;
          background:currentColor;
        }

        .feed-container{
          display:flex;
          flex-direction:column;
          gap:12px;
          max-height:400px;
          overflow-y:auto;
        }

        .feed-item{
          background:rgba(255,255,255,.03);
          border-radius:8px;
          padding:12px;
        }

        .feed-time{
          display:flex;
          align-items:center;
          gap:4px;
          font-size:.75rem;
          color:var(--text-secondary);
        }

        .feed-link{
          color:var(--text-primary);
          text-decoration:none;
        }

        .feed-link:hover{
          color:var(--accent);
        }

        .feed-snippet{
          color:var(--text-secondary);
        }
      `}</style>
    </div>
  );
};

export default ThreatFeed;