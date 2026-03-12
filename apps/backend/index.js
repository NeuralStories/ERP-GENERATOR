require('dotenv').config();
const express = require('express');
const cors = require('cors');
const chatRouter = require('./routes/chat');
const healthRouter = require('./routes/health');
const ingestRouter = require('./routes/ingest');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Routes
app.use('/api/chat', chatRouter);
app.use('/api/chat', healthRouter);
app.use('/api/chat', ingestRouter);

app.get('/health', (req, res) => {
    res.json({ status: 'ok', service: 'ERP-GENERATOR Chat Backend' });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
