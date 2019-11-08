import express, { Application, Request, Response } from 'express';

const PORT = 3000;
const HOST = '0.0.0.0';

const app: Application = express();

const printResponseInfo = (req: Request, res: Response) => {
  console.log(req.method, req.originalUrl, res.statusCode);
};

app.get('/', (req: Request, res: Response) => {
  res.send('Hello world');
  printResponseInfo(req, res);
});

app.all('*', (req: Request, res: Response) => {
  res.status(404).send('404 not found');
  printResponseInfo(req, res);
});

app.listen(PORT, HOST, () => console.log(`Example app listening on http://${HOST}:${PORT}!`));
