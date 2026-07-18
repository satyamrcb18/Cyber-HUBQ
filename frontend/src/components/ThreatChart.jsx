import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Activity } from 'lucide-react';

const data = [
  { name: '00:00', phishing: 12, malware: 5, ddos: 0 },
  { name: '04:00', phishing: 19, malware: 8, ddos: 2 },
  { name: '08:00', phishing: 45, malware: 12, ddos: 5 },
  { name: '12:00', phishing: 32, malware: 15, ddos: 18 },
  { name: '16:00', phishing: 28, malware: 9, ddos: 4 },
  { name: '20:00', phishing: 15, malware: 4, ddos: 1 },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{
        background: 'rgba(10, 15, 30, 0.9)',
        border: '1px solid var(--glass-border)',
        padding: '10px 15px',
        borderRadius: '8px',
        boxShadow: '0 4px 15px rgba(0,0,0,0.5)',
        backdropFilter: 'blur(10px)'
      }}>
        <p style={{ margin: '0 0 10px 0', fontWeight: 'bold', color: 'var(--text-primary)' }}>{label}</p>
        {payload.map((entry, index) => (
          <div key={index} style={{ color: entry.color, display: 'flex', justifyContent: 'space-between', gap: '15px', marginBottom: '5px', fontSize: '0.9rem' }}>
            <span>{entry.name}:</span>
            <span style={{ fontWeight: 'bold' }}>{entry.value}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

const ThreatChart = () => {
  return (
    <div className="glass-panel" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <h2 className="title">
        <Activity style={{ color: 'var(--accent)' }} size={24} />
        Threat Activity (24h)
      </h2>
      <div style={{ flex: 1, minHeight: '300px', width: '100%', marginTop: '10px' }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
            <XAxis dataKey="name" stroke="var(--text-secondary)" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis stroke="var(--text-secondary)" fontSize={12} tickLine={false} axisLine={false} />
            <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'rgba(255,255,255,0.1)', strokeWidth: 1, strokeDasharray: '5 5' }} />
            <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
            <Line type="monotone" dataKey="phishing" name="Phishing" stroke="#00f0ff" strokeWidth={3} dot={{ r: 4, fill: '#030712', strokeWidth: 2 }} activeDot={{ r: 6, fill: '#00f0ff' }} />
            <Line type="monotone" dataKey="malware" name="Malware" stroke="#ff003c" strokeWidth={3} dot={{ r: 4, fill: '#030712', strokeWidth: 2 }} activeDot={{ r: 6, fill: '#ff003c' }} />
            <Line type="monotone" dataKey="ddos" name="DDoS" stroke="#ffb800" strokeWidth={3} dot={{ r: 4, fill: '#030712', strokeWidth: 2 }} activeDot={{ r: 6, fill: '#ffb800' }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ThreatChart;
