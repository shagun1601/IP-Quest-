const express = require('express');
const { register, login, getMe, updateDetails, deleteAccount } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);
router.put('/updatedetails', protect, updateDetails);
router.delete('/deleteaccount', protect, deleteAccount);

module.exports = router;
