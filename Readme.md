# Odjazdowo - Warsaw public transport live departures Messenger bot 🚃🤖

This project is a Messenger bot that will tell you the nearest departures from a public transport stop in Warsaw in real time.

It is designed to run on the Cloudflare Workers and uses Prisma Data Proxy as the DB.

This repo contains management scripts necessary to set it up as well the code responsible for handling and responding to request sent by Messenger API.

## How it works

The whole workflow is as follows:

1. Scrape the website containing the list with of all the stations of the Warsaw Public Transport and their platforms.
2. Call the specific endpoint to get the IDs of platforms for which live departure information is available.
3. Merge data from `1.` and `2.` and save it in `Stations` and `Platforms` tables in a Postgres database hosted on Prisma Data Proxy.
4. When a request from Messenger comes in, get the text of user's message and split it into what should be the station name and platform number. Example: `Centrum 06`.
5. Using the Prisma API, find the matching station and/or platform in the database. If the match is ambiguous, respond with [Quick Replies](https://developers.facebook.com/docs/messenger-platform/send-messages/quick-replies) so that user can easily choose what they really want.

## Prerequisites

1. Cloudflare Workers account.
2. Prisma Data proxy account.
3. Facebook page that users will chat with and Meta Developers account.

Having the above will provide you with all necessary API keys and urls that you need to get the bot running. See `.env.example` and `wrangler.toml.example` files to get the idea what you need.

I won't tell you how to get the `SIP_TW_API_KEY`. Sorry - you need to figure it out yourself.

## Installation

1. Install dependencies

```
npm i
```

2. Install Wrangler

```
npm i -g wrangler
```

2. Generate Prisma

```
npx prisma generate --data-proxy
```

3. Set up wrangler

```
npx wrangler init && npx wrangler login
```

## Usage

### Setting up

You will firstly need to scrape the web and fill your Database. You can do it using some npm scripts:

- `npm run scrapeAndFillDB` - scrapes the web and fills the database. It takes some time to complete so you don't want to do this very often.
- `npm run dumpDB` - saves the content of the database ot a JSON files in the `data` directory
- `npm run clearDB` - removes all records from the `station` and `platform` tables in the database.
- `npm run fillDBFromFile` - fills the database based on the content of JSON files in `data` directory. Useful when you want to move the database but don't want to scrape again.

### Deployment

After all it's done, you can deploy the bot to Cloudflare Workers.

```
npm run deploy
```

After than you need to set up the callback url in the app dashboard.

It should be `<YOUR-APP-NAME>.workers.dev/messenger-webhook`.

And that's it! You can start messaging your page and enjoy cold-start-less responses from your API! 🎉

## Development

### Testing pure API

```
npm run test "muranow 5"
```

### Testing as on Cloudflare worker

Start wrangler

```
npm run dev
```

Send a request

```
curl -X POST http://localhost:8787 -H "Content-Type: application/json" -d '{"query": "muranow 5"}'
```
