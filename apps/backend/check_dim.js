require('dotenv').config({ path: 'c:/Users/Usuari/Documents/GeneracionNombresERP/apps/backend/.env' });
const { getEmbedding } = require('./services/rag/embeddings');

async function checkDim() {
    try {
        const emb = await getEmbedding('test');
        console.log('DIMENSIÓN REAL:', emb.length);
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}
checkDim();
