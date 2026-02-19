const mongoose = require('mongoose');

const organizationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, enum: ['civic','enterprise','hybrid'], default: 'civic' },
  subscriptionTier: { type: String, enum: ['free','pro','enterprise'], default: 'free' },
  subdomain: { type: String, unique: true, required: true },
  settings: {
    allowAnonymousReports: { type: Boolean, default: true },
    requireEvidenceForCrime: { type: Boolean, default: true },
    slaEnabled: { type: Boolean, default: true },
    retentionPolicyDays: { type: Number, default: 365 }
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Organization', organizationSchema);
