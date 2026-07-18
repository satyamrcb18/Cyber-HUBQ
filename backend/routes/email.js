const express = require('express');
const router = express.Router();

// 1. Phishing Email Analyzer Route
router.post('/analyze', (req, res) => {
  const { text } = req.body;

  if (!text) {
    return res.status(400).json({ error: 'Email text is required' });
  }

  const content = text.toLowerCase();
  
  // Heuristic keywords often used in phishing
  const phishingKeywords = [
    'urgent', 'immediate action required', 'account suspended', 'verify your account',
    'click here', 'password reset', 'bank', 'winner', 'lottery', 'invoice', 
    'unauthorized login', 'update your billing', 'gift card',
    'malicious', 'fake', 'scam', 'spam', 'hacker', 'crypto', 'bitcoin', 'claim your prize',
    'refund', 'suspended', 'security alert', 'warning'
  ];

  let matchedKeywords = [];
  let score = 0;

  phishingKeywords.forEach(keyword => {
    if (content.includes(keyword)) {
      matchedKeywords.push(keyword);
      score += 1;
    }
  });

  // Calculate Risk Level
  let riskLevel = 'Safe';
  if (score >= 3) {
    riskLevel = 'High Risk';
  } else if (score > 0) {
    riskLevel = 'Suspicious';
  }

  res.json({
    status: 'success',
    riskLevel,
    score,
    matchedKeywords
  });
});

// 2. Email Breach Checker (Mock logic for BCA Project)
router.post('/breach', (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  const queryEmail = email.toLowerCase();

  // Mock list of "breached" emails for demonstration purposes
  const mockBreachedEmails = [
    'test@example.com',
    'hacked@gmail.com',
    'admin@company.com',
    'user@yahoo.com'
  ];

  // Random simulation for other emails: 30% chance of breach for demo effect
  // But we hardcode some to ALWAYS be breached for reliable presentation
  let isBreached = mockBreachedEmails.includes(queryEmail);
  
  if (!isBreached) {
    // optional: add pseudo-random logic based on email length
    if (queryEmail.length > 20 && queryEmail.includes('123')) {
      isBreached = true;
    }
  }

  setTimeout(() => {
    if (isBreached) {
      res.json({
        status: 'Breached',
        message: 'This email was found in known data breaches!',
        sources: ['Canva (2019)', 'LinkedIn (2012)', 'Adobe (2013) भी ho sakta hai']
      });
    } else {
      res.json({
        status: 'Safe',
        message: 'Good news! No data breaches found for this email.',
        sources: []
      });
    }
  }, 800); // Artificial delay to simulate API call
});

module.exports = router;
