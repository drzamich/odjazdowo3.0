### Prerequisites

1. `.env` file with the following data:

```
PRISMA_CLIENT_ENGINE_TYPE='dataproxy'
DATABASE_URL=prisma://...
```

### Installation

1. Install dependencies

```
npm i
```

2. Generate Prisma

```
npx prisma generate
```

### Testing

```
npm run test "muranow 5"
```
