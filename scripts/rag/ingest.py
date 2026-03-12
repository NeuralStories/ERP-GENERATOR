import os
import argparse
import requests
import psycopg2
from psycopg2.extras import execute_values
import uuid

# Configuración desde variables de entorno
DB_URL = os.getenv('DATABASE_URL')
LMSTUDIO_URL = os.getenv('LMSTUDIO_URL', 'http://localhost:1234/v1')
EMBEDDING_MODEL = os.getenv('EMBEDDING_MODEL', 'text-embedding-nomic-embed-text-v1.5')

def get_embedding(text):
    response = requests.post(
        f"{LMSTUDIO_URL}/embeddings",
        json={"model": EMBEDDING_MODEL, "input": text.replace('\n', ' ')}
    )
    response.raise_for_status()
    return response.json()['data'][0]['embedding']

def chunk_text(text, size=500, overlap=50):
    words = text.split()
    chunks = []
    for i in range(0, len(words), size - overlap):
        chunk = " ".join(words[i:i + size])
        chunks.append(chunk)
        if i + size >= len(words):
            break
    return chunks

def ingest_file(file_path, source_name):
    print(f"Procesando: {file_path}")
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    chunks = chunk_text(content)
    data_to_insert = []
    
    for chunk in chunks:
        embedding = get_embedding(chunk)
        data_to_insert.append((
            str(uuid.uuid4()),
            chunk,
            embedding,
            source_name,
            '{}' # metadata vacío por ahora
        ))
    
    conn = psycopg2.connect(DB_URL)
    cur = conn.cursor()
    
    # execute_values es eficiente para inserciones masivas
    execute_values(cur, 
        "INSERT INTO erp_embeddings (id, content, embedding, source, metadata) VALUES %s",
        data_to_insert
    )
    
    conn.commit()
    cur.close()
    conn.close()
    print(f"Insertados {len(data_to_insert)} chunks.")

def main():
    parser = argparse.ArgumentParser(description='Ingesta de documentos para RAG')
    parser.add_argument('--path', required=True, help='Ruta al archivo o carpeta')
    parser.add_argument('--source', required=True, help='Nombre de la fuente')
    args = parser.parse_args()

    if os.path.isfile(args.path):
        ingest_file(args.path, args.source)
    elif os.path.isdir(args.path):
        for root, dirs, files in os.walk(args.path):
            for file in files:
                if file.endswith(('.txt', '.md', '.csv')):
                    ingest_file(os.path.join(root, file), args.source)

if __name__ == "__main__":
    main()
