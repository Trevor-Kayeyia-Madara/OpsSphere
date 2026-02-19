const mongoose = require('mongoose');

const evidenceSchema = new mongoose.Schema({
  tenantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Organization', required: true },
  incidentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Incident', required: true },
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  fileUrl: { type: String, required: true },
  fileType: String,
  metadata: {
    fileSize: Number,
    checksum: String,
    uploadedIp: String
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('EvidenceFile', evidenceSchema);
