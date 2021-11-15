import { Router } from 'express';

import { AuthenticateUserController } from '../../../../modules/accounts/useCases/authenticateUser/AuthenticateUserController';

const authenticateRoutes = Router();

const authenticateUserController = new AuthenticateUserController();
const refreshTokenController = new AuthenticateUserController();

authenticateRoutes.post('/sessions', authenticateUserController.handle);

authenticateRoutes.post('/refresh-token', refreshTokenController.handle);

export { authenticateRoutes };
