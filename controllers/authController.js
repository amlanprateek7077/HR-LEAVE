const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const speakeasy = require('speakeasy');
const QRCode = require('qrcode');
const User = require('../models/User');

function signToken(id, expiresIn = '7d') {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'dev_secret', { expiresIn });
}

exports.register = async (req, res) => {
  try {
    const { name, email, password, department, role } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Missing fields' });
    }
    const exists = await User.findOne({ email });
    if (exists) return res.status(409).json({ message: 'Email already registered' });
    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, passwordHash, department, role: role || 'employee' });

    // Generate TOTP secret for setup
    const secret = speakeasy.generateSecret({ name: `HR E-Leave (${user.email})` });
    user.totp.secret = secret.base32;
    user.totp.enabled = false;
    await user.save();

    // Generate QR
    const otpauth = secret.otpauth_url;
    const qrDataURL = await QRCode.toDataURL(otpauth);

    const tempToken = signToken(user._id, '10m'); // temporary token for setup
    return res.status(201).json({
      message: 'Registered. Complete TOTP setup.',
      user: { id: user._id, email: user.email, name: user.name, role: user.role },
      totp: { otpauth, qrDataURL },
      tempToken
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.setupTotp = async (req, res) => {
  try {
    // expects Authorization bearer temp token
    const user = req.user;
    if (!user) return res.status(401).json({ message: 'Unauthorized' });

    if (!user.totp?.secret) {
      const secret = speakeasy.generateSecret({ name: `HR E-Leave (${user.email})` });
      user.totp = { secret: secret.base32, enabled: false };
      await user.save();
    }

    const otpauth = `otpauth://totp/HR%20E-Leave%20(${encodeURIComponent(user.email)})?secret=${user.totp.secret}&issuer=HR%20E-Leave`;
    const qrDataURL = await QRCode.toDataURL(otpauth);
    return res.json({ otpauth, qrDataURL });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.verifyTotpAndEnable = async (req, res) => {
  try {
    const user = req.user;
    const { token } = req.body;
    const verified = speakeasy.totp.verify({
      secret: user.totp.secret,
      encoding: 'base32',
      token,
      window: 1
    });
    if (!verified) return res.status(400).json({ message: 'Invalid TOTP' });
    user.totp.enabled = true;
    await user.save();
    return res.json({ message: 'TOTP enabled successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });
    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(400).json({ message: 'Invalid credentials' });

    if (user.totp.enabled) {
      const tempToken = signToken(user._id, '10m');
      return res.json({ requiresTOTP: true, tempToken });
    } else {
      // allow login without TOTP only if not enabled yet
      const token = signToken(user._id);
      return res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
    }
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.loginTotp = async (req, res) => {
  try {
    const user = req.user;
    const { token: totpToken } = req.body;
    if (!user.totp.enabled) return res.status(400).json({ message: 'TOTP not enabled for user' });

    const verified = speakeasy.totp.verify({
      secret: user.totp.secret,
      encoding: 'base32',
      token: totpToken,
      window: 1
    });
    if (!verified) return res.status(400).json({ message: 'Invalid TOTP' });

    const fullToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'dev_secret', { expiresIn: '7d' });
    return res.json({ token: fullToken, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
