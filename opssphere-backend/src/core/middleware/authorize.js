const jwt = require('jsonwebtoken');

const authorize = (...allowedRoles) => (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ message: 'Unauthorized' });

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;

    if (!allowedRoles.includes(decoded.role))
      return res.status(403).json({ message: 'Forbidden' });

    next();
  } catch (err) {
    return res.status(401).json({ message: 'Unauthorized', error: err.message });
  }
};

module.exports = authorize;
