const express = require('express');
const router = express.Router();
const authorize = require('../../core/middleware/authorize');
const AuditLog = require('./audit.model');
const { success, error } = require('../../core/utils/response');

// GET /api/auditlogs?entity=Incident&start=2026-01-01&end=2026-01-31&role=admin
router.get('/', authorize('admin'), async (req, res) => {
  try {
    const { entity, role, start, end } = req.query;
    const filter = { tenantId: req.user.tenantId };

    if (entity) filter.entityType = entity;
    if (role) filter.userRole = role;
    if (start || end) filter.actionTimestamp = {};
    if (start) filter.actionTimestamp.$gte = new Date(start);
    if (end) filter.actionTimestamp.$lte = new Date(end);

    const logs = await AuditLog.find(filter).sort({ actionTimestamp: -1 });
    success(res, logs, 'Audit logs fetched');
  } catch (err) {
    error(res, err.message);
  }
});

module.exports = router;