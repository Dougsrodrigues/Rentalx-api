import express, { NextFunction, Response, Request } from 'express';
import 'express-async-errors';
import 'reflect-metadata';
import swaggerUi from 'swagger-ui-express';
import './loadEnv';

import swaggerFile from '../../../swagger.json';
import { AppError } from '../../errors/AppError';
import createConnection from '../database';
import { router } from './routes';

import '../../container';

createConnection();
const app = express();

app.use(express.json());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerFile));

app.use(router);

app.use(
  (err: Error, request: Request, response: Response, next: NextFunction) => {
    if (err instanceof AppError) {
      return response.status(err.statusCode).json({
        message: err.message,
      });
    }

    return response.status(500).json({
      status: 'error',
      message: `Internal serve error - ${err.message}`,
    });
  }
);
export { app };
