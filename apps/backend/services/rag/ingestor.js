const { getEmbedding } = require('./embeddings');
const { Pool } = require('pg');
const { v4: uuidv4 } = require('uuid');

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

/**
 * Divide el texto en fragmentos (chunks) con solapamiento.
 */
function chunkText(text, size = 500, overlap = 50) {
    const words = text.split(/\s+/);
    const chunks = [];
    
    for (let i = 0; i < words.length; i += (size - overlap)) {
        const chunk = words.slice(i, i + size).join(' ');
        chunks.push(chunk);
        if (i + size >= words.length) break;
    }
    
    return chunks;
}

/**
 * Procesa un texto y lo guarda en la base de datos de embeddings.
 */
async function ingest(text, sourceName, metadata = {}) {
    const chunks = chunkText(text);
    console.log(`Ingestando ${chunks.length} chunks desde fuente: ${sourceName}`);
    
    const results = [];
    
    for (const chunk of chunks) {
        try {
            const embedding = await getEmbedding(chunk);
            
            const sql = `
                INSERT INTO erp_embeddings (id, content, embedding, source, metadata)
                VALUES ($1, $2, $3::vector, $4, $5)
                RETURNING id;
            `;
            
            const values = [
                uuidv4(),
                chunk,
                `[${embedding.join(',')}]`,
                sourceName,
                JSON.stringify(metadata)
            ];
            
            const res = await pool.query(sql, values);
            results.push(res.rows[0].id);
        } catch (error) {
            console.error('Error ingestando chunk:', error);
            // Continuamos con el resto si uno falla
        }
    }
    
    return {
        success: true,
        chunksProcessed: chunks.length,
        insertedCount: results.length,
        source: sourceName
    };
}

module.exports = { ingest, chunkText };
