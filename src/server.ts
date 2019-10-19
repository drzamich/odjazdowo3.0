import express from 'express';
import ZtmScraper from './scraper/implementation/ZtmScraper';
import axios from 'axios';

const PORT = Number(process.env.PORT) || 3000;
const HOST = '0.0.0.0';

const app: express.Application = express();

app.get('/', async (req, res) => {
  res.send('Hello world!')
});

app.listen(PORT, HOST, () => console.log(`Example app listening on http://${HOST}:${PORT}!`));
