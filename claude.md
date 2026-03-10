# Contexto del Proyecto: Hub Modular y Panel de Administración

## Arquitectura Principal
- Sistema modular con Front-End centralizado.
- Patrón Repositorio estricto: El Front-End NUNCA se comunica directamente con la base de datos. Todo pasa por una capa de servicio (`dbService`).
- Base de datos actual: Supabase (PostgreSQL). Preparado para migración a PostgreSQL puro.

## Reglas de Desarrollo
1.  **Archivos Completos:** Al generar código, proporciona el archivo completo y funcional. No omitas partes con comentarios.
2.  **Desacoplamiento BaaS:** No utilices métodos específicos de Supabase (`supabase.auth`, `supabase.from`) dentro de los componentes de la interfaz de usuario.
3.  **Auditoría Obligatoria:** Toda interacción con los módulos (Generadores, Asistente IA) debe invocar la función de registro en `system_logs`.
4.  **Control de Acceso (RBAC):** La interfaz debe adaptarse al rol del usuario, pero la seguridad final siempre debe estar respaldada por RLS (Row Level Security) en la base de datos.
5.  **Módulo IA (Manuales):** Utiliza un enfoque RAG. Las respuestas de la IA deben estar estrictamente limitadas al contexto de los manuales proporcionados.
