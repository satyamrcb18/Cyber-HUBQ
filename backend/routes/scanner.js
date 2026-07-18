const express = require('express');
const axios = require('axios');
const { URL } = require('url');
const dns = require('dns').promises;
const router = express.Router();

router.post('/', async (req, res) => {
  const { url } = req.body;

  if (!url) {
    return res.status(400).json({ error: 'URL is required' });
  }

  // Real-life check: Verify if the domain actually exists / is online
  try {
    const parsedUrl = new URL(url);
    await dns.lookup(parsedUrl.hostname);
  } catch (error) {
    // If URL is improperly formatted or DNS lookup fails (domain doesn't exist)
    return res.json({
      status: 'Unreachable',
      details: {
        query_status: 'offline',
        message: 'This website does not exist, is offline, or is a fake URL.'
      }
    });
  }

  // If there's no API key, let's use a mocked system for the BCA project demonstration
  if (!process.env.URLHAUS_API_KEY) {
    console.warn("URLHAUS_API_KEY environment variable is not set. Using mocked response for testing.");
    
    // Simple mock logic: if the URL contains 'malicious', 'phishing', or 'malware', treat it as bad.
    const isMockMalicious = url.toLowerCase().includes('malicious') || 
                            url.toLowerCase().includes('phishing') || 
                            url.toLowerCase().includes('malware');
    
    // Simulate a slight network delay
    await new Promise(resolve => setTimeout(resolve, 600));

    if (isMockMalicious) {
      return res.json({
        status: 'Malicious',
        details: {
          query_status: 'ok',
          url_status: 'online',
          date_added: new Date().toISOString().split('T')[0],
          tags: ['mock-malware', 'phishing']
        }
      });
    } else {
      return res.json({
        status: 'Safe',
        details: {
          query_status: 'no_results'
        }
      });
    }
  }

  try {
    const data = new URLSearchParams();
    data.append('url', url);

    const response = await axios.post(
      'https://urlhaus-api.abuse.ch/v1/url/',
      data,
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Auth-Key': process.env.URLHAUS_API_KEY
        }
      }
    );

    const body = response.data;

    // Handle authentication API errors
    if (body && body.query_status === 'unknown_auth_key') {
      return res.status(401).json({ error: 'Invalid URLhaus API Key configured in backend.' });
    }

    if (body && body.query_status === 'ok') {
      res.json({
        status: 'Malicious',
        details: body
      });
    } else if (body && body.query_status === 'no_results') {
      res.json({
        status: 'Safe',
        details: body
      });
    } else {
      res.json({
        status: 'Unknown',
        details: body
      });
    }

  } catch (error) {
    console.error('URL Scanner Error:');
    console.error('Message:', error.message);
    console.error('Response:', error.response?.data);
    console.error('Status:', error.response?.status);

    res.status(500).json({
      error: error.response?.data?.error || error.message || 'An unexpected error occurred',
      response: error.response?.data
    });
  }
});

module.exports = router;