require('dotenv').config();
const express = require('express');
const connectDB = require('./core/database/mongoose');

const app = express();
app.use(express.json());

connectDB();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
