import 'reflect-metadata';

import mongoose from 'mongoose';
import { InversifyExpressServer } from 'inversify-express-utils';
import { container } from './IoC';
import { PORT, MONGODB_URI } from './config';

const server = new InversifyExpressServer(container);

const app = server.build();

const HOST = '0.0.0.0';

mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true }).then(
  () => {
    console.log('Connected to the database');
  },
).catch(err => {
  console.log('MongoDB connection error. Please make sure MongoDB is running. ', err);
});

app.listen(PORT, HOST, () => { console.log(`Server started at ${HOST}:${PORT}`); });
