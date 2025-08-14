const router = require('express').Router();
const jwt = require('jsonwebtoken');
const { register, setupTotp, verifyTotpAndEnable, login, loginTotp } = require('../controllers/authController');

// middleware to auth temp token
function tempAuth(req, res, next) {
  try {
    const authHeader = req.headers.authorization || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
    if (!token) return res.status(401).json({ message: 'No token' });
    const payload = jwt.verify(token, process.env.JWT_SECRET || 'dev_secret');
    req.userId = payload.id;
    next();
  } catch (e) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
}

const User = require('../models/User');
async function attachUser(req, res, next) {
  try {
    const authHeader = req.headers.authorization || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
    if (!token) return res.status(401).json({ message: 'No token' });
    const payload = jwt.verify(token, process.env.JWT_SECRET || 'dev_secret');
    const user = await User.findById(payload.id);
    if (!user) return res.status(401).json({ message: 'Invalid user' });
    req.user = user;
    next();
  } catch (e) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
}

router.post('/register', register);
router.post('/login', login);
router.get('/totp-setup', attachUser, setupTotp);
router.post('/totp-enable', attachUser, verifyTotpAndEnable);
router.post('/login/totp', attachUser, loginTotp);

module.exports = router;
