const express = require('express');
const crawlWebsite = require('./main'); // Import the function from main.js
const app = express();
const port = 3000;

// Define a route to trigger the crawl
app.get('/crawl', async (req, res) => {
  const baseURL = req.query.url; // Get the URL from query parameters

  if (!baseURL) {
    return res.status(400).json({ error: 'No website provided' });
  }

  try {
    const results = await crawlWebsite(baseURL);
    res.json(results);
  } catch (error) {
        console.error('Crawling error:', error);

    res.status(500).json({ error: 'Failed to perform crawl' });
  }
});

// Serve a simple HTML page to display results
app.get('/', (req, res) => {
  res.send(`
    <html>
      <head>
        <title>Web Crawler Results</title>
      </head>
      <body>
        <h1>Web Crawler</h1>
        <form id="crawlForm">
          <input type="text" id="urlInput" placeholder="Enter URL" required>
          <button type="submit">Start Crawl</button>
        </form>
        <div id="results"></div>
        <script>
          document.getElementById('crawlForm').addEventListener('submit', async function(event) {
            event.preventDefault();
            const url = document.getElementById('urlInput').value;
            const response = await fetch('/crawl?url=' + encodeURIComponent(url));
            const data = await response.json();
            document.getElementById('results').innerHTML = '<pre>' + JSON.stringify(data, null, 2) + '</pre>';
          });
        </script>
      </body>
    </html>
  `);
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});