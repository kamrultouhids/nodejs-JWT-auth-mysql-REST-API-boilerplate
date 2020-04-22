import { Router } from 'express';
const apiRoute = Router();
import log from '../../middlewares/log';
import authenticate from '../../middlewares/authenticate';
import UserController from '../../controllers/UserController';
import LoginController from '../../controllers/auth/LoginController';
import RegisterController from '../../controllers/auth/RegisterController';
import ResetPasswordController from '../../controllers/auth/ResetPasswordController';

apiRoute.get('/welcome', (req, res) => {
    return res.status(200).json({
        success: true,
        data: null,
        message: 'Welcome to  api',
    });
});

// Authentication Routes...
apiRoute.post('/login', LoginController.login);

// Registration Routes...
apiRoute.post('/register', [log], RegisterController.register);
apiRoute.post('/account-verification', [log], RegisterController.accountVerification);
apiRoute.post('/account-verification-resend', [log], RegisterController.accountVerificationResend);

// Password Reset Routes...
apiRoute.post('/password/forgot', [log], ResetPasswordController.passwordForgot);
apiRoute.post('/password/forgot-code-match', [log], ResetPasswordController.passwordForgotCodeMatch);
apiRoute.post('/password/reset', [log], ResetPasswordController.passwordRest);

// User Routes...
apiRoute.get('/users', [log,authenticate], UserController.index);
apiRoute.put('/users/:id/toggle-status', [log, authenticate], UserController.toggleStatus);

export default apiRoute;
