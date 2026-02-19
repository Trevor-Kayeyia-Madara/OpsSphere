const express = require('express');
const router = express.Router();
const authorize = require('../../core/middleware/authorize');
const { createIncident } = require('./incident.service');
const Incident = require('./incident.model');

router.post('/', authorize('member','responder','admin'), async (req, res) => {
  try {
    const incident = new Incident({
      ...req.body,
      tenantId: req.user.tenantId,
      reportedBy: req.user.userId
    });

    incident._userId = req.user.userId;
    incident._ip = req.ip;
    incident._userAgent = req.headers['user-agent'];

    await incident.save();

    res.status(201).json(incident);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/', authorize('responder','admin'), async (req, res) => {
  const incidents = await Incident.find({ tenantId: req.user.tenantId });
  res.json(incidents);
});

module.exports = router;
