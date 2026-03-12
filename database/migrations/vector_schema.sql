-- Activación de pgvector y tabla para RAG
CREATE EXTENSION IF NOT EXISTS vector;

-- Tabla para embeddings del ERP
CREATE TABLE IF NOT EXISTS erp_embeddings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    content TEXT NOT NULL,
    embedding vector(1536), -- Vector de 1536 dimensiones (compatible con OpenAI/LMStudio)
    source TEXT,
    metadata JSONB,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Índice HNSW para búsqueda por similitud de coseno rápida
-- Nota: HNSW es mejor para búsquedas rápidas en grandes volúmenes de datos
CREATE INDEX IF NOT EXISTS idx_erp_embeddings_hnsw ON erp_embeddings 
USING hnsw (embedding vector_cosine_ops) 
WITH (m = 16, ef_construction = 64);
