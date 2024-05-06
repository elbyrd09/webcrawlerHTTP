const { JSDOM } = require('jsdom')
// const fetch = require('node-fetch').default.fetch;



async function crawlPage(currentURL){
	console.log(`actively crawling: ${currentURL}`)

	try{
		const resp = await fetch(currentURL)

		// validate that we're getting back a valid response that is not a 400 or 500 error level
		if (resp.status > 399){
			console.log(`error in fetch with status code: ${resp.status} on page: ${currentURL}`)
			return
			// we'll stop crawling the page with 'return'
		}


		// we also want to validate that HTML is being passed back and not another data type.
		// easily, we can parse the headers to determine this
		const contentType = resp.headers.get("content-type")
		if (!contentType.includes("text/html")){
			// does NOT include "text/html".  using !== will still allow an output like
			/// "text/html; charset=UTF-8" to fail when it should pass
			console.log(`non html response: ${contentType} on page: ${currentURL}`)
			return
		}


		// we want either a 200 or 300 level response code

		console.log(await resp.text())
		// using the text method since the getURLsFromHTML takes 
		// data as a string as opposed to fetch which I'm more used to
		// getting data in JSON format

	}catch(err){
		console.log(`error in fetch: ${err.message}, on page: ${currentURL}`)
	}

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