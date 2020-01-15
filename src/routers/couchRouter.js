import express from 'express';

import CouchController from '../controllers/couch';

const couchRouter = express.Router();

couchRouter.all('/*', CouchController.validateRequest);
couchRouter.all('/*', CouchController.proxyUserDB);

export default couchRouter;
