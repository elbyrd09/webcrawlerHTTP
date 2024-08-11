const { JSDOM } = require('jsdom')
// const fetch = require('node-fetch').default.fetch;



async function crawlPage(baseURL, currentURL, pages){
	// to crawl just 1 page, the crawlPage(currentURL) is sufficient
	// to crawl an entire site, we need the function to take 3 arguments
	// baseURL is the homepage of the site (currentURL has to be on same domain as baseURL)
	// currentURL is the page actively crawling
	// pages object tracks pages crawled so far

	const baseURLObj = new URL(baseURL)
	const currentURLObj = new URL(currentURL)
	if (baseURLObj.hostname !== currentURLObj.hostname) {
		// if the host names are different, we'll just skip the page
		// since it would mean the currentURL doesn't live on the same
		// domain as the baseURL
		return pages
	}

	const normalizedCurrentURL = normalizeURL(currentURL)
	// the way we can check if we've already crawled the page
	// is to determine if the currentURL existed in the pages object
	// the pages object is a map of normalized URLs to the # of times
	// we've seen the given URL
	if (pages[normalizedCurrentURL] > 0){
		pages[normalizedCurrentURL]++
		return pages
	}

	pages[normalizedCurrentURL] = 1

	console.log(`actively crawling: ${currentURL}`)
	// only want to log this when we're crawling a new page


	try{
		const resp = await fetch(currentURL)

		// validate that we're getting back a valid response that is not a 400 or 500 error level
		if (resp.status > 399){
			console.log(`error in fetch with status code: ${resp.status} on page: ${currentURL}`)
			return pages
			// we'll stop crawling the page with 'return'
		}


		// we also want to validate that HTML is being passed back and not another data type.
		// easily, we can parse the headers to determine this
		const contentType = resp.headers.get("content-type")
		if (!contentType.includes("text/html")){
			// does NOT include "text/html".  using !== will still allow an output like
			/// "text/html; charset=UTF-8" to fail when it should pass
			console.log(`non html response: ${contentType} on page: ${currentURL}`)
			return pages
		}


		// we want either a 200 or 300 level response code

		const htmlBody = await resp.text();
		// using the text method since the getURLsFromHTML takes 
		// data as a string as opposed to fetch which I'm more used to
		// getting data in JSON format


		const nextURLs = getURLsFromHTML(htmlBody, baseURL)

		for(const nextURL of nextURLs){

			pages = await crawlPage(baseURL, nextURL, pages)

			// crawl root page, find all links, and then crawl pages within root
			// either we're hitting links external to site
			// or we're hitting links we've already crawled
			// it is an exhaustive crawl

		}


	}catch(err){
		console.log(`error in fetch: ${err.message}, on page: ${currentURL}`)
	}

	return pages

}

function getURLsFromHTML(htmlBody, baseURL){
	// grab all URLs or links embedded within a webpage
	// html body is string representing HTML of page and baseURL is the URL to be crawled 
	// and returns an array of URL strings
	const urls = []
	const dom = new JSDOM(htmlBody)
	// object creates an in memory object that represents HTML tree structure
	const linkElements = dom.window.document.querySelectorAll('a')
	for (const linkElement of linkElements){
		if (linkElement.href.slice(0, 1) === '/'){
			//relative
			try{
				const urlObj = new URL(`${baseURL}${linkElement.href}`)
				// if the URL constructor throws an error, we'll catch it
				urls.push(urlObj.href)
			} catch (err){
				console.log(`error with relative url: ${err.message}`)
			}
		} else{
			//absolute
			try{
				const urlObj = new URL(linkElement.href)
				// doesn't need to parse absolute URL the same as how the URL
				// constructor did for the relative URL because we already know
				// its an absolute URL given we're in the "else"
				urls.push(urlObj.href)
			} catch (err){
				console.log(`error with absolute url: ${err.message}`)
			}
		}
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
	getURLsFromHTML,
	crawlPage
}