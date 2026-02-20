// incident.routes.js
const express = require('express');
const router = express.Router();
const authorize = require('../../core/middleware/authorize');
const { createIncident, getIncidents } = require('./services/incident.service');
const { success, error } = require('../../core/utils/response');

router.post('/', authorize('member','responder','admin'), async (req, res) => {
  try {
    const incident = await createIncident({
      body: req.body,
      user: req.user,
      ip: req.ip,
      userAgent: req.headers['user-agent']
    });
    success(res, incident, 'Incident created');
  } catch (err) {
    error(res, err.message);
  }
});

router.get('/', authorize('responder','admin'), async (req, res) => {
  try {
    const incidents = await getIncidents(req.user);
    success(res, incidents, 'Incidents fetched');
  } catch (err) {
    error(res, err.message);
  }
});

module.exports = router;