const express = require('express');
const router = express.Router();
const { registerUser, loginUser } = require('./auth.service');
const { success, error } = require('../../core/utils/response');

router.post('/register', async (req, res) => {
  try {
    const user = await registerUser(req.body);
    res.status(201).json(user);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const result = await loginUser(req.body);
    success(res, result, 'User logged in successfully');
  } catch (err) {
    error(res, err.message, 401);
  }
});

module.exports = router;
