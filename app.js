import express from 'express';
import bodyParser from 'body-parser';

const app = express();
app.use(bodyParser.json());

import passport from 'passport';
import './src/passport';
app.use(passport.initialize());

import userRouter from './src/routers/userRouter';
import couchRouter from './src/routers/couchRouter';

app.use('/api/v1', userRouter);
app.use('/couchdb', couchRouter);

import logger from './src/logger';
logger.info('Pino is logging...');

export default app;
