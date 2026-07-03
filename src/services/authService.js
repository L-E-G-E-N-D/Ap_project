const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const prisma = require('../config/db');
const AppError = require('../utils/appError');

const register = async (name, email, password) => {
  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    throw new AppError('Email already exists', 409);
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: { name, email, password: hashedPassword }
  });

  const { password: _, ...userWithoutPassword } = user;
  return userWithoutPassword;
};

const login = async (email, password) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    throw new AppError('Invalid email or password', 401);
  }

  const isPasswordMatch = await bcrypt.compare(password, user.password);
  if (!isPasswordMatch) {
    throw new AppError('Invalid email or password', 401);
  }

  const token = jwt.sign(
    { id: user.id },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );

  const { password: _, ...userWithoutPassword } = user;
  return { user: userWithoutPassword, token };
};

module.exports = { register, login };
