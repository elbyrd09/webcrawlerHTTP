// async and await - async ALWAYS means the function is a promise
// so if you invoke getTodos() elsewhere, its going to return a promise
// promise is NON-BLOCKING so threads can continue

const getTodos = async () => {

	const response = await fetch('/todos/luigi.json');
	// await stalls JS from assigning value to response before the promise is resolved
	const data = await response.json();
	// await stalls json() until data is ready to be assigned to data var	
	return data;
	// we want access to the data with return

}

getTodos()
.then(data =>  console.log('resolved', data));
	//once promise resolves in getTodos(), we want to do something,
	// via the then() callback, with the data

// fetch api

// fetch('todos/luigi.json').then((response) => {
	// fetch is just anothe promise so we can add a then() callback function
// 		console.log('resolved', response);
	// print response is resolved
// 		return response.json();
	// return response object (using Response interface) with the json data
	// json data is included BY DEFAULT with the json() method
// 	}). then(data => {
// 		console.log(data);
	// log the data from the json() method

// 	}).catch((err) => {
// 		console.log('rejected', err);
// 	});