const express = require('express');
const router = express.Router();
const LLMFactory = require('../services/llm/factory');

/**
 * GET /api/chat/health
 * Health check detallado con latencia.
 */
router.get('/health', async (req, res) => {
    const providerNames = LLMFactory.listProviders();

    const results = await Promise.allSettled(providerNames.map(async name => {
        const start = Date.now();
        try {
            const provider = LLMFactory.getProvider(name);
            const health = await provider.healthCheck();
            const latency = Date.now() - start;
            return { name, ...health, latency };
        } catch (err) {
            return { name, available: false, error: err.message, latency: Date.now() - start };
        }
    }));

    const healthData = results.map(r => r.status === 'fulfilled' ? r.value : { error: 'Unknown' });

    res.json({
        timestamp: new Date().toISOString(),
        providers: healthData
    });
});

module.exports = router;
