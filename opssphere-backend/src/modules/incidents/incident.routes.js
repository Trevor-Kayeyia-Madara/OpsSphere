// incident.routes.js
const express = require('express');
const router = express.Router();
const authorize = require('../../core/middleware/authorize');
const {createIncident, getIncidents, getIncidentStats, getIncidentHeatmap, getIncidentTrends, getAssignedWorkload} = require('./services/incident.service');


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

// Stats endpoint
router.get('/stats', authorize('admin','responder'), async (req, res) => {
  try {
    const stats = await getIncidentStats(req.user);
    success(res, stats, 'Incident stats fetched');
  } catch (err) {
    error(res, err.message);
  }
});

// Heatmap endpoint
router.get('/heatmap', authorize('admin','responder'), async (req, res) => {
  try {
    const data = await getIncidentHeatmap(req.user);
    success(res, data, 'Incident heatmap fetched');
  } catch (err) {
    error(res, err.message);
  }
});

// Trends endpoint
router.get('/trends', authorize('admin','responder'), async (req, res) => {
  try {
    const trends = await getIncidentTrends(req.user);
    success(res, trends, 'Incident trends fetched');
  } catch (err) {
    error(res, err.message);
  }
});

// Assigned workload endpoint
router.get('/assigned-workload', authorize('admin','responder'), async (req, res) => {
  try {
    const workload = await getAssignedWorkload(req.user);
    success(res, workload, 'Assigned workload fetched');
  } catch (err) {
    error(res, err.message);
  }
});

module.exports = router;