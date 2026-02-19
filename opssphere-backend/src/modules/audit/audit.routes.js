const express = require('express');
const router = express.Router();
const authorize = require('../../core/middleware/authorize');
const AuditLog = require('./audit.model');

router.get('/', authorize('admin'), async (req, res) => {
  const logs = await AuditLog.find({ tenantId: req.user.tenantId })
    .sort({ createdAt: -1 });

  res.json(logs);
});

module.exports = router;
