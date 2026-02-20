const Incident = require('../incident.model');
const mongoose = require('mongoose');

const createIncident = async ({ body, user, ip, userAgent }) => {
  const incident = new Incident({
    ...body,
    tenantId: user.tenantId,
    reportedBy: user.userId
  });

  // Attach audit context for pre-save hook
  incident._ip = ip;
  incident._userAgent = userAgent;

  await incident.save();
  return incident;
};


// Get Incidents for listing (RBAC aware)
const getIncidents = async (user) => {
  const tenantId = new mongoose.Types.ObjectId(user.tenantId);

  // Member can see only incidents they reported
  if (user.role === 'member') {
    return Incident.find({ tenantId, reportedBy: user.userId }).sort({ createdAt: -1 });
  }

  // Responder/Admin see all tenant incidents
  return Incident.find({ tenantId }).sort({ createdAt: -1 });
};

// Stats by status, priority, category
const getIncidentStats = async (user) => {
  const tenantId = new mongoose.Types.ObjectId(user.tenantId);
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
  const tenantId = new mongoose.Types.ObjectId(user.tenantId);
  return Incident.find({ tenantId }, { location: 1, title: 1, status:1 });
};

// Monthly/weekly trends
const getIncidentTrends = async (user) => {
  const tenantId = new mongoose.Types.ObjectId(user.tenantId);
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
  const tenantId = new mongoose.Types.ObjectId(user.tenantId);
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
module.exports = { createIncident, getIncidents, getIncidentStats, getIncidentHeatmap, getIncidentTrends, getAssignedWorkload};
