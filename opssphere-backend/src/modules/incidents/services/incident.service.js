const Incident = require('../incident.model');
const mongoose = require('mongoose');

const createIncident = async (tenantId, reportedBy, incidentData, auditContext) => {
  const incident = new Incident({
    ...incidentData,
    tenantId,
    reportedBy
  });

  // Attach audit context for pre-save hook
  incident._ip = auditContext.ip;
  incident._userAgent = auditContext.userAgent;

  await incident.save();
  return incident;
};

const getIncidentsForDashboard = async (user) => {
  const tenantId = user.tenantId;
  if (user.role === 'member') {
    throw new Error('Access denied for dashboard data');
  }
  // Filter by tenant for responder/admin
  return Incident.find({ tenantId });
};

// Stats by status, priority, category
const getIncidentStats = async (user) => {
  const tenantId = mongoose.Types.ObjectId(user.tenantId);
  const stats = await Incident.aggregate([
    { $match: { tenantId } },
    {
      $group: {
        _id: null,
        byStatus: { $push: { status: "$status" } },
        byPriority: { $push: { priority: "$priority" } },
        byCategory: { $push: { category: "$category" } }
      }
    }
  ]);
  return stats[0] || {};
};

// Heatmap coordinates
const getIncidentHeatmap = async (user) => {
  const tenantId = mongoose.Types.ObjectId(user.tenantId);
  return Incident.find({ tenantId }, { location: 1, title: 1, status:1 });
};

// Monthly/weekly trends
const getIncidentTrends = async (user) => {
  const tenantId = mongoose.Types.ObjectId(user.tenantId);
  const trends = await Incident.aggregate([
    { $match: { tenantId } },
    {
      $group: {
        _id: { month: { $month: "$createdAt" }, year: { $year: "$createdAt" } },
        count: { $sum: 1 }
      }
    },
    { $sort: { "_id.year": 1, "_id.month": 1 } }
  ]);
  return trends;
};

// Assigned workload per officer
const getAssignedWorkload = async (user) => {
  const tenantId = mongoose.Types.ObjectId(user.tenantId);
  const workload = await Incident.aggregate([
    { $match: { tenantId, assignedTo: { $exists: true } } },
    {
      $group: {
        _id: "$assignedTo",
        count: { $sum: 1 }
      }
    }
  ]);
  return workload;
};
module.exports = { createIncident , getIncidentStats, getIncidentHeatmap, getIncidentTrends, getAssignedWorkload};
