const authService = require('../services/authService');
const { success } = require('../utils/apiResponse');

const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    const user = await authService.register(name, email, password);
    return res.status(201).json(success('User registered successfully', user));
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const result = await authService.login(email, password);
    return res.status(200).json(success('Login successful', result));
  } catch (error) {
    next(error);
  }
};

module.exports = { register, login };
