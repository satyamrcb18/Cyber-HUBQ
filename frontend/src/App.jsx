import React from 'react';
import { motion } from 'framer-motion';
import { ShieldAlert } from 'lucide-react';
import UrlScanner from './components/UrlScanner';
import ThreatFeed from './components/ThreatFeed';
import Quiz from './components/Quiz';
import EmailAnalyzer from './components/EmailAnalyzer';
import DashboardOverview from './components/DashboardOverview';
import ThreatChart from './components/ThreatChart';
import './App.css';

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: 'spring', stiffness: 100 }
  }
};

function App() {
  return (
    <div className="dashboard-layout">
      {/* Top Banner / Navbar */}
      <header className="topbar">
        <div className="brand">
          <ShieldAlert color="var(--accent)" size={28} />
          <h1>SOC <span className="text-gradient">NexGen</span></h1>
        </div>
        <div className="status-indicator">
          <div className="status-dot"></div>
          System Active
        </div>
      </header>

      {/* Main Grid Area */}
      <motion.main 
        className="main-content"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants} className="area-overview" style={{ height: '100%' }}>
          <DashboardOverview />
        </motion.div>
        
        <motion.div variants={itemVariants} className="area-chart" style={{ height: '100%' }}>
          <ThreatChart />
        </motion.div>

        <motion.div variants={itemVariants} className="area-scanner" style={{ height: '100%' }}>
          <UrlScanner />
        </motion.div>
        
        <motion.div variants={itemVariants} className="area-feed" style={{ height: '100%' }}>
          <ThreatFeed />
        </motion.div>

        <motion.div variants={itemVariants} className="area-email" style={{ height: '100%' }}>
          <EmailAnalyzer />
        </motion.div>

        <motion.div variants={itemVariants} className="area-quiz" style={{ height: '100%' }}>
          <Quiz />
        </motion.div>
      </motion.main>
    </div>
  );
}

export default App;
