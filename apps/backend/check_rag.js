require('dotenv').config({ path: 'c:/Users/Usuari/Documents/GeneracionNombresERP/apps/backend/.env' });
const { Pool } = require('pg');

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

async function checkCount() {
    try {
        const res = await pool.query('SELECT count(*), source FROM erp_embeddings GROUP BY source');
        console.log('--- Resumen de erp_embeddings ---');
        res.rows.forEach(row => {
            console.log(`Fuente: ${row.source} | Chunks: ${row.count}`);
        });
        if (res.rows.length === 0) {
            console.log('La tabla está vacía.');
        }
        process.exit(0);
    } catch (err) {
        console.error('Error:', err.message);
        process.exit(1);
    }
}

checkCount();
