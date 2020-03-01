import 'reflect-metadata';

import mongoose from 'mongoose';
import { InversifyExpressServer } from 'inversify-express-utils';
import * as bodyParser from 'body-parser';
import { container } from './IoC';
import { PORT, MONGODB_URI } from './config';

const server = new InversifyExpressServer(container);

server.setConfig(app => {
  // add body parser
  app.use(bodyParser.urlencoded({
    extended: true,
  }));
  app.use(bodyParser.json());
});

const app = server.build();

mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true, dbName: 'odjazdowo' }).then(
  () => {
    console.log('Connected to the database');
  },
).catch(err => {
  console.log('MongoDB connection error. Please make sure MongoDB is running. ', err);
});

app.listen(PORT, () => { console.log(`Listenin on port ${PORT}`); });
