const { Pool } = require('pg');
require('dotenv').config({ path: 'c:/Users/Usuari/Documents/GeneracionNombresERP/apps/backend/.env' });

const dbUrl = process.env.DATABASE_URL;

const pool = new Pool({
  connectionString: dbUrl,
  ssl: { rejectUnauthorized: false }
});

async function migrate() {
    console.log('--- Corrigiendo dimensión de pgvector (1536 -> 192) ---');
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        
        // 1. Borrar índice dependiente
        await client.query('DROP INDEX IF EXISTS idx_erp_embeddings_hnsw');
        
        // 2. Recrear tabla
        await client.query('DROP TABLE IF EXISTS erp_embeddings');
        
        await client.query(`
            CREATE TABLE erp_embeddings (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                content TEXT NOT NULL,
                embedding vector(192), 
                source TEXT,
                metadata JSONB,
                created_at TIMESTAMPTZ DEFAULT now()
            )
        `);
        
        await client.query(`
            CREATE INDEX idx_erp_embeddings_hnsw ON erp_embeddings 
            USING hnsw (embedding vector_cosine_ops) 
            WITH (m = 16, ef_construction = 64)
        `);
        
        await client.query('COMMIT');
        console.log('✅ Base de datos actualizada con éxito a 192 dimensiones.');
        process.exit(0);
    } catch (err) {
        await client.query('ROLLBACK');
        console.error('❌ Error migrando:', err.message);
        process.exit(1);
    } finally {
        client.release();
    }
}

migrate();
