const { getEmbedding } = require('./embeddings');
const { Pool } = require('pg');

// Asumimos que la config de DB viene de variables de entorno (Supabase/Local)
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

/**
 * Recupera contextos relevantes desde pgvector.
 */
async function retrieve(query, options = {}) {
    // Bajamos ligeramente el umbral por defecto a 0.70 para ser más inclusivos con información relevante
    const topK = options.topK || parseInt(process.env.RAG_TOP_K) || 5;
    const threshold = options.threshold || parseFloat(process.env.RAG_SIMILARITY_THRESHOLD) || 0.70;

    try {
        const embedding = await getEmbedding(query);
// ... linea 18
        const embeddingStr = `[${embedding.join(',')}]`;

        const sql = `
      SELECT content, source, metadata, (1 - (embedding <=> $1::vector)) as similarity
      FROM erp_embeddings
      WHERE (1 - (embedding <=> $1::vector)) > $2
      ORDER BY similarity DESC
      LIMIT $3
    `;

        const result = await pool.query(sql, [embeddingStr, threshold, topK]);
        return result.rows;
    } catch (error) {
        console.error('Error in retrieve:', error);
        return [];
    }
}

/**
 * Construye el prompt inyectando el contexto de forma estricta.
 */
function buildRAGPrompt(userQuery, chunks) {
    if (!chunks || chunks.length === 0) {
        return `Lo siento, no he encontrado información específica en los manuales del ERP para responder a tu pregunta. 
        PREGUNTA: ${userQuery}`;
    }

    const context = chunks
        .map((c, i) => `### DOCUMENTO ${i + 1} (Fuente: ${c.source})\n${c.content}`)
        .join('\n\n');

    return `INSTRUCCIÓN CRÍTICA: Eres un asistente técnico especializado en el ERP. 
Utiliza EXCLUSIVAMENTE el CONTEXTO proporcionado a continuación para responder. 
- Si la respuesta no está en el contexto, di "No tengo información en mis manuales sobre esto". 
- NO inventes datos, nombres, rutas o procesos que no aparezcan aquí.
- Mantén un tono profesional y cita la fuente si es relevante.

---
CONTEXTO DE MANUALES DEL ERP:
${context}
---

PREGUNTA DEL USUARIO:
${userQuery}

RESPUESTA (basada únicamente en el contexto anterior):`;
}

module.exports = { retrieve, buildRAGPrompt };
