const { OpenAI } = require('openai');

const client = new OpenAI({
    baseURL: process.env.LMSTUDIO_URL || 'http://localhost:1234/v1',
    apiKey: 'lm-studio',
});

/**
 * Genera el embedding de un texto usando LM Studio.
 * El modelo debe ser compatible con 1536 dimensiones (ej: nomic-embed-text).
 */
async function getEmbedding(text) {
    try {
        const response = await client.embeddings.create({
            model: process.env.EMBEDDING_MODEL || 'text-embedding-nomic-embed-text-v1.5',
            input: text.replace(/\n/g, ' '),
        });

        return response.data[0].embedding;
    } catch (error) {
        console.error('❌ Error llamando a LM Studio para embeddings:', error.message);
        if (error.response) {
            console.error('Detalles del error:', error.response.data);
        }
        throw error;
    }
}

module.exports = { getEmbedding };
