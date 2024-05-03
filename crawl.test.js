const {normalizeURL} = require('./crawl.js')
const {test, expect} = require ('@jest/globals')

test('normalizeURL strip protocol', () => {
	const input = 'https://blog.boot.dev/path'
	const actual = normalizeURL(input)
	const expected = 'blog.boot.dev/path'
	expect(actual).toEqual(expected)
	// I'm expecting actual output of normalizeURL to == expected
})

//adding another test to handle the presence of a trailing slash

test('normalizeURL strip trailing slash', () => {
	const input = 'https://blog.boot.dev/path/'
	const actual = normalizeURL(input)
	const expected = 'blog.boot.dev/path'
	expect(actual).toEqual(expected)
	// I'm expecting actual output of normalizeURL to == expected
})


//adding another test to the test suite to handle capital letters

test('normalizeURL capitals', () => {
	const input = 'https://BLOG.boot.dev/path'
	const actual = normalizeURL(input)
	const expected = 'blog.boot.dev/path'
	expect(actual).toEqual(expected)
	// I'm expecting actual output of normalizeURL to == expected
})


test('normalizeURL strip http', () => {
	const input = 'http://BLOG.boot.dev/path'
	const actual = normalizeURL(input)
	const expected = 'blog.boot.dev/path'
	expect(actual).toEqual(expected)
	// I'm expecting actual output of normalizeURL to == expected
})