const Incident = require('../incident.model');
const AuditLog = require('../../audit/audit.model');
const mongoose = require('mongoose');

const checkAndEscalateIncidents = async () => {
  const now = new Date();

  // Find incidents past SLA deadline and not resolved/closed
  const incidents = await Incident.find({
    slaDeadline: { $lt: now },
    status: { $nin: ['resolved', 'closed', 'escalated'] }
  });

  for (const incident of incidents) {
    // Increment escalation level
    incident.escalationLevel += 1;
    incident.status = 'escalated';
    await incident.save();

    // Create audit log entry
    await AuditLog.create({
      tenantId: incident.tenantId,
      userId: incident.assignedTo || incident.reportedBy,
      action: 'escalate',
      entityType: 'Incident',
      entityId: incident._id,
      previousValue: { status: 'in_progress', escalationLevel: incident.escalationLevel - 1 },
      newValue: { status: 'escalated', escalationLevel: incident.escalationLevel },
      ipAddress: null,
      userAgent: null
    });

    // Optional: console log / send notification
    console.log(`Incident ${incident._id} escalated due to SLA breach`);
  }

  return incidents.length;
};

module.exports = { checkAndEscalateIncidents };