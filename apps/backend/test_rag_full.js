require('dotenv').config({ path: 'c:/Users/Usuari/Documents/GeneracionNombresERP/apps/backend/.env' });
const { getEmbedding } = require('./services/rag/embeddings');
const { ingest } = require('./services/rag/ingestor');

async function test() {
    console.log('--- Iniciando prueba de RAG ---');
    console.log('Modelo configurado:', process.env.EMBEDDING_MODEL);
    
    try {
        console.log('1. Probando generación de embedding...');
        const emb = await getEmbedding('Este es un texto de prueba para el ERP');
        console.log('✅ Embedding generado. Dimensión:', emb.length);
        
        console.log('2. Probando ingesta directa...');
        const result = await ingest('Contenido de prueba para el sistema RAG del ERP.', 'Test-Script', { test: true });
        console.log('✅ Resultado de ingesta:', JSON.stringify(result, null, 2));
        
        process.exit(0);
    } catch (err) {
        console.error('❌ Fallo en la prueba:', err.message);
        if (err.response) console.error('Data:', err.response.data);
        process.exit(1);
    }
}

test();
