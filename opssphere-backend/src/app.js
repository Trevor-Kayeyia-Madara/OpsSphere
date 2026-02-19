require('dotenv').config();
const express = require('express');
const connectDB = require('./core/database/mongoose');
const tenantResolver = require('./core/middleware/tenantResolver');
const authorize = require('./core/middleware/authorize');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const AuditContext = require('./core/middleware/AuditContext');

// Security middleware  
app.use(helmet());

app.use(rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 60,             // max 60 requests per minute
  message: 'Too many requests, please try again later'
}));

const app = express();
app.use(express.json());
app.use(AuditContext);

// Connect to MongoDB
connectDB();

// Use tenant resolver middleware
app.use(tenantResolver);

// Example route
app.get('/api/test', (req, res) => {
  res.json({ message: 'Tenant resolved', tenant: req.tenant.name });
});

app.get('/api/incidents', authorize('admin', 'responder'),(req, res) => {

});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
