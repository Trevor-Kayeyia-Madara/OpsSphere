require('dotenv').config();
const express = require('express');
const connectDB = require('./core/database/mongoose');
const tenantResolver = require('./core/middleware/tenantResolver');
const authorize = require('./core/middleware/authorize');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const AuditContext = require('./core/middleware/AuditContext');
const authRoutes = require('./modules/auth/auth.routes');
const incidentRoutes = require('./modules/incidents/incident.routes');
const auditRoutes = require('./modules/audit/audit.routes');



const app = express();
app.use(express.json());
app.use(AuditContext);

// Connect to MongoDB
connectDB();

// Use tenant resolver middleware
app.use(tenantResolver);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/incidents', incidentRoutes);
app.use('/api/auditlogs', auditRoutes);

// Health check
app.get('/api/test', (req, res) => {
  res.json({ message: 'OpsSphere Backend Running', tenant: req.tenant });
});

// Security middleware  
app.use(helmet());

app.use(rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 60,             // max 60 requests per minute
  message: 'Too many requests, please try again later'
}));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
