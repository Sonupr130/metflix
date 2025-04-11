import express from 'express';
import { authAdmin, getAdminProfile, logoutAdmin, registerAdmin } from '../controllers/authController.js';
import protect  from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/', registerAdmin);
router.post('/auth', authAdmin);
router.post('/logout', logoutAdmin);
router.route('/profile').get(protect, getAdminProfile);

export default router;