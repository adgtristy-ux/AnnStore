const express = require('express');
const { body, validationResult } = require('express-validator');
const Admin = require('../models/Admin');

const router = express.Router();

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

/* -- POST /api/admin/login -- verify admin credentials -- */
router.post(
  '/login',
  [
    body('username').trim().notEmpty().withMessage('Username is required'),
    body('password').notEmpty().withMessage('Password is required'),
  ],
  validate,
  async (req, res, next) => {
    try {
      const { username, password } = req.body;

      const admin = await Admin.findOne({ username });
      if (!admin) {
        return res.status(401).json({ message: 'Invalid username or password' });
      }

      // Plain text comparison (simple for assignment)
      if (admin.password !== password) {
        return res.status(401).json({ message: 'Invalid username or password' });
      }

      res.json({ message: 'Login successful', username: admin.username });
    } catch (err) {
      next(err);
    }
  }
);

module.exports = router;
