const { JSDOM } = require('jsdom')


function getURLsFromHTML(htmlBody, baseURL){
	// grab all URLs or links embedded within a webpage
	// html body is string representing HTML of page and baseURL is the URL to be crawled 
	// and returns an array of URL strings
	const urls = []
	const dom = new JSDOM(htmlBody)
	// object creates an in memory object that represents HTML tree structure
	const linkElements = dom.window.document.querySelectorAll('a')
	for (const linkElement of linkElements){
		urls.push(linkElement.href)
	}
	return urls
}


function normalizeURL(urlString){
	const urlObj = new URL(urlString)
	const hostPath = `${urlObj.hostname}${urlObj.pathname}`
	if (hostPath.length > 0 && hostPath.slice(-1) === '/'){
		return hostPath.slice(0, -1)
		//give me everything but the last character
	}
		return hostPath
}

module.exports = {
	normalizeURL,
	getURLsFromHTML
}