const Incident = require('./incident.model');

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

module.exports = { createIncident };
