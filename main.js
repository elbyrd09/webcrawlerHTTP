const { crawlPage } = require('./crawl.js')


function main(){
	// an entry point function into our application
	if( process.argv.length < 3){
		// object at global level called process and argv is used to grab the command line arguments
		console.log("no website provided")
		process.exit(1)
		// 1 is a standard error code (if not enough command input given)
	}
	if( process.argv.length > 3){
		// object at global level called process and argv is used to grab the command line arguments
		console.log("too many command line args")
		process.exit(1)
		// 1 is a standard error code (if not enough command input given)
	}
		const baseURL = process.argv[2]
		// 3rd argument in the array at position [2]
		console.log(`starting crawl of ${baseURL}`)
		crawlPage(baseURL)
}

main()
//script takes as input, a website, and need to be able to take that via the CLI



// answer to why process.argv.length < 3
// for (const arg of process.argv){
// console.log(arg) }
// (1) interpreter / name of program always comes first given OS
// (2) name of file used to provide entry point into application
// and the (3rd) argument is the one passed into the program (so < 3)