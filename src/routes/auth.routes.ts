import { validate, validateBody } from '../middleware/validator';
import { loginSchema, registerSchema } from '../schemas/auth.schema';

router.post('/login', validateBody(loginSchema), authController.login);
router.post('/register', validateBody(registerSchema), authController.register);