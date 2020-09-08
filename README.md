# Laptop store

![cover](cover.png)

The purpose of this project is to understand the basics of Node.js by creating an online laptop store based on an HTML template. Everything is done manually, no framework such as Express is used.

When clicking on a product, the url changes and the id from the query is used to fill the HTML template with the right information:

![cover-product](cover-product.png)

---

<br />



## Running the project

In order to run the project `node` is needed and `nodemon` recommended.

1. Open terminal in folder and type `nodemon`
2. Open browser address and go to `127.0.0.1:1337`





<br />



## Structure

1. Reading data from `json`
2. Creating the web server
3. Creating a response for the server
4. Implementing routing
5. Templating
6. Taking care of the images



<br />

## Process

Required packages:

```js
const fs = require('fs');
const http = require('http');
const url = require('url');
```



<br />

**1. Reading the content of `data.json` and parse it into a JS object:**

```js
// read and parse laptop data
const json = fs.readFileSync(`${__dirname}/data/data.json`, 'utf-8');
const laptopData = JSON.parse(json);
```

<details>
  <summary><strong>Details</strong></summary>
  <ul>
    <li>👉🏻 <code>readFile</code> is a method of <code>fs</code></li>
    <li>⚠️ we have to pass the absolute path of the file:  In Node.js, there is a variable name called <code>dirname</code> </li>
    <li>we have to specify <code>utf-8</code> otherwise instead of returning a file, it retuns sth called a buffer.</li>
	<li>we save the result into a variable</li>
  </ul>
</details>



<br />

**2. Creating the web server**

```js
server.listen(1337, '127.0.0.1', () => {
	console.log('Listening for requests now');
});
```

<details>
  <summary><strong>Details</strong></summary>
  <ol>
    <li>We create a variable called server and then on the hhtp object use the createServer method. we have to pass in a callback function that will be fired each time sb accesses our web server. this callback function gets access to the request and the response objects</li>
    <li>We listen to a specific port and specific IP address: <code>listen()</code> method tells node to always keep listening on a certain port or a certain IP address</li>
    <li>As soon as it starts listening, a callback function gets fired, which is the way we have to know that the server has started listening</li>
  </ol>
</details>



<br />

**3. Creating a response for the server, when it is accessed**

```js
const server = http.createServer((req, res) => {
	res.writeHead(200, { 'Content-type': 'text/html'})
	res.end('This is the response!');	
});
```

<details>
  <summary><strong>Details</strong></summary>
  <ol>
    <li><strong>HTTP header<strong></strong>: is a small message that we send with a request to let the browser know what kind of data is coming. In this example, we are sending an html file.</strong></li>
  </ol>
</details>




<br /> 

**4. Implementing routing**

**Routing** is being able to respond in different ways for different URLs. We use `url` package for this

```js
const server = http.createServer((req, res) => {
	const pathName = url.parse(req.url, true).pathname;
	
	if (pathName === '/products' || pathName === '/') {
		res.writeHead(200, {'Content-type': 'text/html'});
		res.end('This is products page');
	} 
	
	else if ( pathName === '/laptop') {
		res.writeHead(200, {'Content-type': 'text/html'});
		res.end('This is laptop page');
	}
	
	else {
		res.writeHead(404, {'Content-type': 'text/html'});
		res.end('URL was not found on the server');
	}
});
```

<details>
  <summary><strong>Details</strong></summary>
  <ol>
    <li>we use the request object because that's where the url is stored</li>
  </ol>
</details>

Since there will be different laptops, we need to retrieve the id from each laptop from the url
```js
const query = url.parse(req.url, true).query;
```

if we have url:
```bash
127.0.0.1:1337/laptop?id=4&name=banana&date=today
````

The query object will be:

```js
query: {
	id: '4',
	name: 'banana',
	date: 'today'
}
````

we use `id` so that it gives us the value of the id directly
```js
const server = http.createServer((req, res) => {
// pathName...
const id = url.parse(req.url, true).query.id;
//...
res.writeHead(200, { 'Content-type': 'text/html' });
res.end(`This is laptop page for laptop ${id}`);

})


```


there are only X laptops so if user tries to use an id that doesn't exist -> error
```js
//...
  } else if (pathName === '/laptop' && id < laptopData.length) {
  //...
```

we update the if statement for `/laptop` pathname



<br />

**5. Using templating**


---


There is an HTML template that will be filled with the data for each of the laptops. 
- price
- name
- image
- characteristics
- description

We take the template and everything that is data, we replace it with a placeholder, making sure there is not another string with the same value. Example:
```html
<p class="laptop__price">${%PRICE%}</p>
````
👉🏻 we are going to load the HTML file, replace all the placeholders with real data and send that HTML to the browser each time we request a certain laptop.

```js
else if (pathName === '/laptop' && id < laptopData.length) {
	res.writeHead(200, { 'Content-type': 'text/html'} );
	
	fs.readFile(`${__dirname}/templates/template-laptop.html`, 'utf-8', (err, data) => {
		const laptop = laptopData[id];
		let output = data.replace(/{%PRODUCTNAME%}/g, laptop.productName);
		outpupt = output.replace(/{%IMAGE%}/g, laptop.image);
		outpupt = output.replace(/{%PRICE%}/g, laptop.price);
		outpupt = output.replace(/{%SCREEN%}/g, laptop.screen);
		outpupt = output.replace(/{%CPU%}/g, laptop.cpu);
		outpupt = output.replace(/{%STORAGE%}/g, laptop.storage);
		outpupt = output.replace(/{%RAM%}/g, laptop.ram);
		outpupt = output.replace(/{%DESCRIPTION%}/g, laptop.description);
		res.end(output);
	})

}
````

When it finishes reading the file, it passes de `data` into the callback function, replacing the placeholders.
⚠️ because we have two placeholders price, we need to use a regular expression, to replace both instances


----

<br />

We do the same for product overview. We loop through all laptops and create one html card for each of them 

👉🏻 create template with placeholders (cards). `template-card.html`

**overview**
```html
  <body>
    <div class="container">
      <h1>The Laptop Store!</h1>
      <div class="cards-container">{%CARDS%}</div>
    </div>
  </body>
````

**card**
```html
<figure class="card">
  <div class="card__hero">
    <img src="/{%IMAGE%}" alt="{%PRODUCTNAME%}" class="card__img" />
  </div>
  <h2 class="card__name">{%PRODUCTNAME%}</h2>
  <p class="card__detail"><span class="emoji-left">🖥</span> {%SCREEN%}</p>
  <p class="card__detail"><span class="emoji-left">🧮</span> {%CPU%}</p>
  <div class="card__footer">
    <p class="card__price">{%PRICE%}</p>
    <a href="/latop?id={%ID%}" class="card__link"
      >Check it out <span class="emoji-right">👉</span></a
    >
  </div>
</figure>
````



We create the function that replaces the placeholders
```js
function replaceTemplate(originalHtml, laptop) {
       let output = originalHtml.replace(/{%PRODUCTNAME%}/g, laptop.productName);
        output = output.replace(/{%IMAGE%}/g, laptop.image);
        output = output.replace(/{%PRICE%}/g, laptop.price);
        output = output.replace(/{%SCREEN%}/g, laptop.screen);
        output = output.replace(/{%CPU%}/g, laptop.cpu);
        output = output.replace(/{%STORAGE%}/g, laptop.storage);
        output = output.replace(/{%RAM%}/g, laptop.ram);
        output = output.replace(/{%DESCRIPTION%}/g, laptop.description);
		output = output.replace(/{%ID%}/g, laptop.id);
		return output;
}
```

We serve the template in the products  url

```js
  if (pathName === '/products' || pathName === '/') {
    res.writeHead(200, { 'Content-type': 'text/html' });
	
	fs.readFile(`${__dirname}/templates/template-overview.html`, 'utf-8', (err, data) => {
	
		let output = data;

		fs.readFile(`${__dirname}/templates/template-card.html`, 'utf-8', (err, data) => {
		
			const cardsOutput = laptopData.map(laptop => replaceTemplate(data, laptop)).join('');
			output = output.replace('{%CARDS%}', cardsOutput);
			
			res.end(output);
		})
	
	})
	
}	
```



---



<br />

**6. Taking care of the images:**
⚠️ Node.js doesn't serve any files by default: every url is like a route 👉🏻 it treats the `src` attribute of the html `<img>` as a simple request 👉🏻  **in the node.js server the files and folder don't exist**, **everything is a request** and if we request an image, we need to respond to that request. 

We write a route for images in general by using a **regular expression**:

```js
// IMAGEs

else if ((/\.(jpg|jpeg|png||gif)$/i/).test(pathName)) {
	fs.readFile(`${__dirname}/data/img${pathName}`, (err, data) => {
		res.writeHead(200, { 'Content-type': 'image/jpg'});
		res.end(data);
	})
}

````





<br />

## Thanks

This project is based on [Jonas Schmedtmann](https://github.com/jonasschmedtmann) laptop store project. I haven't changed the styles.