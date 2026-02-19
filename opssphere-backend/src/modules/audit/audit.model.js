const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema({
  tenantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Organization', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  action: { type: String, required: true }, // create, update, delete
  entityType: { type: String, required: true }, // e.g., Incident, User
  entityId: { type: mongoose.Schema.Types.ObjectId, required: true },
  previousValue: { type: Object },  // snapshot before change
  newValue: { type: Object },       // snapshot after change
  ipAddress: { type: String },
  userAgent: { type: String },
  createdAt: { type: Date, default: Date.now }
});

auditLogSchema.index({ tenantId: 1, createdAt: -1 });

module.exports = mongoose.model('AuditLog', auditLogSchema);
