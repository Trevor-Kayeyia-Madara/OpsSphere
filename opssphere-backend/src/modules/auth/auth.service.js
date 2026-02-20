const bcrypt = require('bcrypt');
const User = require('../users/user.model');

const registerUser = async ({ fullName, email, password, role, tenantId }) => {
  // For localhost testing, use dummy tenant if tenantId not provided
  const finalTenantId = tenantId || (global.dummyTenantId ? global.dummyTenantId : null);

  // Provide default fullName if missing
  const finalFullName = fullName || 'Local Admin';

  if (!email || !password || !role) {
    throw new Error('Missing required fields');
  }

  // Hash password
  const passwordHash = await bcrypt.hash(password, 12);

  const newUser = await User.create({
    tenantId: finalTenantId,
    fullName: finalFullName,
    email,
    passwordHash,
    role
  });

  return {
    _id: newUser._id,
    email: newUser.email,
    role: newUser.role,
    tenantId: newUser.tenantId
  };
};

const loginUser = async ({ email, password, tenantId }) => {
  // For localhost testing, use dummy tenant if tenantId not provided
  const finalTenantId = tenantId || (global.dummyTenantId ? global.dummyTenantId : null);

  const user = await User.findOne({ email, tenantId: finalTenantId });
  if (!user) throw new Error('Invalid credentials');

  const isValid = await bcrypt.compare(password, user.passwordHash);
  if (!isValid) throw new Error('Invalid credentials');

  const { generateAccessToken, generateRefreshToken } = require('./auth.utils');

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  return { accessToken, refreshToken, user: { _id: user._id, email: user.email, role: user.role, tenantId: user.tenantId } };
};

module.exports = { registerUser, loginUser };