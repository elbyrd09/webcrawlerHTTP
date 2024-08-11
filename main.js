const { crawlPage } = require('./crawl.js')

async function crawlWebsite(baseURL) {
  console.log(`Starting crawl of ${baseURL}`);
  
  try {
    const pages = await crawlPage(baseURL, baseURL, {});
    const results = [];
    for (const page of Object.entries(pages)) {
      results.push(page);
    }
    return results;
  } catch (error) {
    console.error('Error during crawl:', error);
    throw error; // Re-throw the error to be caught in server.js
  }
}

module.exports = crawlWebsite;
