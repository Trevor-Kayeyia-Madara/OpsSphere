const express = require('express');
const router = express.Router();
const authorize = require('../../core/middleware/authorize');
const AuditLog = require('./audit.model');
const { success, error } = require('../../core/utils/response');

router.get('/', authorize('admin'), async (req, res) => {
  const logs = await AuditLog.find({ tenantId: req.user.tenantId })
    .sort({ createdAt: -1 });
  success(res, logs, 'Audit logs fetched');
  //
  res.json(logs);
});

module.exports = router;
