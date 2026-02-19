require('dotenv').config();

const express = require('express');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const connectDB = require('./core/database/mongoose');
const tenantResolver = require('./core/middleware/tenantResolver');
const AuditContext = require('./core/middleware/AuditContext');

const authRoutes = require('./modules/auth/auth.routes');
const incidentRoutes = require('./modules/incidents/incident.routes');
const auditRoutes = require('./modules/audit/audit.routes');

const app = express();

/* =========================
   1️⃣ CONNECT DATABASE
========================= */
connectDB();

/* =========================
   2️⃣ SECURITY MIDDLEWARE
========================= */
app.use(helmet());
app.use(rateLimit({
  windowMs: 60 * 1000,
  max: 60,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many requests, please try again later'
  }
}));

/* =========================
   3️⃣ BODY PARSING
========================= */
app.use(express.json());

/* =========================
   4️⃣ CONTEXT MIDDLEWARE
========================= */
app.use(AuditContext);
app.use(tenantResolver);

/* =========================
   5️⃣ ROUTES
========================= */
app.use('/api/auth', authRoutes);
app.use('/api/incidents', incidentRoutes);
app.use('/api/auditlogs', auditRoutes);

/* =========================
   6️⃣ HEALTH CHECK
========================= */
app.get('/api/test', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'OpsSphere Backend Running',
    tenant: req.tenant || null
  });
});

/* =========================
   7️⃣ 404 HANDLER
========================= */
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

/* =========================
   8️⃣ GLOBAL ERROR HANDLER
========================= */
app.use((err, req, res, next) => {
  console.error('Global Error:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

/* =========================
   9️⃣ START SERVER
========================= */
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
