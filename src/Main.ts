import 'reflect-metadata';

import { InversifyExpressServer } from 'inversify-express-utils';
import { container } from './IoC';

const server = new InversifyExpressServer(container);

const app = server.build();

const HOST = '0.0.0.0';
const PORT: any = process.env.PORT || 3000;

app.listen(PORT, HOST, () => { console.log(`Server started at ${HOST}:${PORT}`); });
