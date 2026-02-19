const bcrypt = require('bcrypt');
const User = require('../users/user.model');

const registerUser = async ({ tenantId, fullName, email, password, role }) => {
  // Hash password
  const passwordHash = await bcrypt.hash(password, 12);

  const newUser = await User.create({
    tenantId,
    fullName,
    email,
    passwordHash,
    role
  });

  return newUser;
};

const loginUser = async ({ email, password, tenantId }) => {
  const user = await User.findOne({ email, tenantId });
  if (!user) throw new Error('Invalid credentials');

  const isValid = await bcrypt.compare(password, user.passwordHash);
  if (!isValid) throw new Error('Invalid credentials');

  const accessToken = require('./auth.utils').generateAccessToken(user);
  const refreshToken = require('./auth.utils').generateRefreshToken(user);

  return { accessToken, refreshToken, user };
};

module.exports = { registerUser, loginUser };

