# Warsaw public transport live departures API

## Prerequisites

1. `.env` file with the following data:

```
PRISMA_CLIENT_ENGINE_TYPE='dataproxy'
DATABASE_URL=prisma://...
```

2. [wrangler](https://github.com/cloudflare/wrangler2) installed

```
npm i -g wrangler
```

## Installation

1. Install dependencies

```
npm i
```

2. Generate Prisma

```
npx prisma generate
```

3. Set up wrangler

```
npx wrangler init && npx wrangler login
```

## Development

### Testing pure API

```
npm run test "muranow 5"
```

### Testing as on Cloudflare worker

Start wrangler

```
npx wrangler dev src/index.ts
```

Send a request

```
curl -X POST http://localhost:8787 -H "Content-Type: application/json" -d '{"foo": 1}'
```
