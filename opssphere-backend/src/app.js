require('dotenv').config();
const express = require('express');
const connectDB = require('./core/database/mongoose');
const tenantResolver = require('./core/middleware/tenantResolver');

const app = express();
app.use(express.json());

// Connect to MongoDB
connectDB();

// Use tenant resolver middleware
app.use(tenantResolver);

// Example route
app.get('/api/test', (req, res) => {
  res.json({ message: 'Tenant resolved', tenant: req.tenant.name });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
