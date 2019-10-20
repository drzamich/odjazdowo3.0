# Messenger bot created with TypeScript and Node.js
In more detail: bot that gives you information about most recent departures of your public mean of transport in Warsaw.

## Manual
It is possible to run the app directly on you machine or using Docker's container.

I recommend the container approach.

This app has been developed with Node.js `10.16.3 LTS`. If you have different Node version (you can check it with `node --version`), you can either change it with [Node Version Manager](https://github.com/nvm-sh/nvm) or expect the unexpected!

... or just use Docker.
### Running the bot inside a container
> longer but more reliable way

Build the image
```
docker build -t <your-desired-name> .
```

Running the container
```
docker run -d -p 3000:3000 <your-desired-name>
```
this command will return a unique `<container-id>` that you might need later.

Stopping the container
```
docker kill <container-id>
```

Running tests
```
docker exec -it <container-id> npm test
```
### Running the bot directly on your machine
> faster but less stable way (that if you don't care about environment configutation of course!)

Simply clone the repository and then:

install dependencies
```
npm i
```

start the server
```
npm start
```

### Running tests
```
npm test
```

## Created with
* [Node.js](https://nodejs.org/en/)
* [Docker](https://www.docker.com/)
* [Express](https://expressjs.com/)
* [Cheerio](https://github.com/cheeriojs/cheerio)
* [Axios](https://github.com/axios/axios)
