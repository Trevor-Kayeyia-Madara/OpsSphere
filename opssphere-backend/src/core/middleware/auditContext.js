const auditContext = (req, res, next) => {
  if (req.user) {
    req.auditContext = {
      userId: req.user.userId,
      ip: req.ip,
      userAgent: req.headers['user-agent']
    };
  }
  next();
};

module.exports = auditContext;
