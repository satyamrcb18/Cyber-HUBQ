import React from 'react';
import { Shield, Activity, Link2, Ghost } from 'lucide-react';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

const StatCard = ({ icon: Icon, title, value, color, glow }) => (
  <div style={{
    background: 'rgba(3, 7, 18, 0.4)',
    border: `1px solid ${color}40`,
    borderRadius: '12px',
    padding: '16px',
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    boxShadow: `0 0 15px ${glow}20`
  }}>
    <div style={{
      background: `${color}20`,
      padding: '12px',
      borderRadius: '8px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      border: `1px solid ${color}60`
    }}>
      <Icon color={color} size={24} />
    </div>
    <div>
      <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{title}</p>
      <h3 style={{ margin: 0, fontSize: '1.4rem', color: 'var(--text-primary)' }} className="data-value">{value}</h3>
    </div>
  </div>
);

const ProgressBar = ({ label, percentage, color }) => (
  <div style={{ marginBottom: '8px' }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '6px' }}>
      <span style={{ color: 'var(--text-secondary)' }}>{label}</span>
      <span style={{ color: 'var(--text-primary)' }} className="data-value">{percentage}%</span>
    </div>
    <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '3px', overflow: 'hidden' }}>
      <div style={{ width: `${percentage}%`, height: '100%', background: color, boxShadow: `0 0 8px ${color}80`, borderRadius: '3px' }}></div>
    </div>
  </div>
);

const DashboardOverview = () => {
  return (
    <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '20px', height: '100%' }}>
      <h2 className="title">
        <Activity className="icon-accent" style={{ color: 'var(--accent)' }} size={24} /> 
        System Overview
      </h2>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', flex: 1 }}>
        <StatCard 
          icon={Link2} 
          title="URLs Scanned (24h)" 
          value="1,248" 
          color="#00f0ff"
          glow="rgba(0, 240, 255,"
        />
        <StatCard 
          icon={Ghost} 
          title="Threats Blocked" 
          value="87" 
          color="#ff003c"
          glow="rgba(255, 0, 60,"
        />
        <StatCard 
          icon={Shield} 
          title="Email Scans" 
          value="342" 
          color="#00ff9d"
          glow="rgba(0, 255, 157,"
        />
      </div>

      <div style={{ 
        marginTop: '10px', 
        padding: '20px', 
        background: 'rgba(3, 7, 18, 0.4)', 
        borderRadius: '12px',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h3 style={{ margin: '0 0 5px 0', fontSize: '1.1rem' }}>Global Risk Score</h3>
            <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Based on aggregated telemetry</p>
          </div>
          <div style={{ width: '70px', height: '70px' }}>
            <CircularProgressbar 
              value={32} 
              text={`${32}/100`}
              strokeWidth={10}
              styles={buildStyles({
                pathColor: 'var(--warning)',
                textColor: 'var(--warning)',
                trailColor: 'rgba(255, 255, 255, 0.05)',
                textSize: '24px',
              })}
            />
          </div>
        </div>

        <div style={{ paddingTop: '15px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
          <h4 style={{ margin: '0 0 12px 0', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Severity Distribution</h4>
          <ProgressBar label="Critical" percentage={12} color="#ff003c" />
          <ProgressBar label="High" percentage={35} color="#ffb800" />
          <ProgressBar label="Medium" percentage={53} color="#00f0ff" />
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;
