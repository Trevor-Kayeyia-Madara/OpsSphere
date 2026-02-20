const mongoose = require('mongoose');
const AuditLog = require('../audit/audit.model');

const incidentSchema = new mongoose.Schema({
  tenantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Organization', required: true },
  title: { type: String, required: true },
  description: { type: String },
  category: { type: String }, // configurable categories per tenant
  priority: { type: String, enum: ['low','medium','high','critical'], default: 'medium' },
  status: { type: String, enum: ['submitted','assigned','in_progress','escalated','resolved','closed'], default: 'submitted' },
  location: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number], default: [0,0] }
  },
  reportedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  escalationLevel: { type: Number, default: 0 },
  slaDeadline: { type: Date },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  resolvedAt: { type: Date }
});

// Indexes
incidentSchema.index({ tenantId: 1, status: 1 });
incidentSchema.index({ location: '2dsphere' });

incidentSchema.pre('save', async function() {
  try {
    const isNew = this.isNew;
    const previous = this._previous || null;

    await AuditLog.create({
      tenantId: this.tenantId,
      userId: this.reportedBy || this.assignedTo,
      action: isNew ? 'create' : 'update',
      entityType: 'Incident',
      entityId: this._id,
      previousValue: previous,
      newValue: this.toObject(),
      ipAddress: this._ip || null,
      userAgent: this._userAgent || null
    });
  } catch (err) {
    console.error('Audit log error:', err);
    // no next() here
  }
});

module.exports = mongoose.model('Incident', incidentSchema);
