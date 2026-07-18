const express = require('express');
const RSSParser = require('rss-parser');
const router = express.Router();

const parser = new RSSParser();
const FEED_URL = 'https://feeds.feedburner.com/TheHackersNews';

router.get('/', (req, res) => {
  // Establish Server-Sent Events headers
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
  });

  res.write('retry: 10000\n\n'); // Reconnect time: 10s

  let intervalId;

  const fetchFeed = async () => {
    try {
      const feed = await parser.parseURL(FEED_URL);
      // We take the latest 5 items to avoid blowing up the payload too much
      const items = feed.items.slice(0, 5).map(item => ({
        title: item.title,
        link: item.link,
        pubDate: item.pubDate,
        contentSnippet: item.contentSnippet ? item.contentSnippet.substring(0, 100) + '...' : ''
      }));

      // Send the items as SSE
      res.write(`data: ${JSON.stringify(items)}\n\n`);
    } catch (error) {
      console.error('Error fetching RSS feed:', error.message);
      // Don't close connection, just wait for next poll
    }
  };

  // Fetch immediately
  fetchFeed();

  // Poll every 60 seconds
  intervalId = setInterval(fetchFeed, 60000);

  // Clean up when client disconnects
  req.on('close', () => {
    clearInterval(intervalId);
    res.end();
  });
});

module.exports = router;
