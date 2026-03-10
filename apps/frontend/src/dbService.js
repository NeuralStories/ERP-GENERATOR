import { createClient } from '@supabase/supabase-js';

// Las variables de entorno en Vite se exponen mediante import.meta.env
// Necesitarás crear un archivo .env en la raíz del proyecto con:
// VITE_SUPABASE_URL=tu_url_aqui
// VITE_SUPABASE_ANON_KEY=tu_anon_key_aqui
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Inicializamos el cliente (secreto interno)
// Si no hay variables de entorno, no estallará inmediatamente, pero avisará
const supabase = supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null;

/**
 * CAPA DE SERVICIO (BaaS Decoupling)
 * El front-end solo consulta estos métodos. Nunca debe exportarse 'supabase' directamente.
 */

export const dbService = {
    // --- AUTENTICACIÓN ---

    async login(email, password) {
        if (!supabase) throw new Error("Supabase no está configurado en .env");
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        return data.user;
    },

    async logout() {
        if (!supabase) return;
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
    },

    async getCurrentSession() {
        if (!supabase) return { session: null, user: null };
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) throw error;
        return { session, user: session?.user || null };
    },

    // --- PERFILES Y ROLES ---

    async getUserRole(userId) {
        if (!supabase || !userId) return null;
        const { data, error } = await supabase
            .from('user_roles')
            .select('role')
            .eq('user_id', userId)
            .maybeSingle();

        if (error) {
            console.error("Error obteniendo rol:", error);
            return null;
        }
        return data?.role || 'user'; // Rol por defecto si no estÃ¡ asignado
    },

    // --- AUDITORÍA (Obligatorio según reglas) ---

    async insertLog(actionType, moduleName, details = {}) {
        if (!supabase) return;
        try {
            const { user } = await this.getCurrentSession();
            if (!user) return; // Si no hay usuario, no se puede loguear

            const { error } = await supabase
                .from('system_logs')
                .insert([{
                    user_id: user.id,
                    action_type: actionType,
                    module_name: moduleName,
                    details: details
                }]);

            if (error) console.error("Error insertando log:", error);
        } catch (e) {
            console.error("Fallo general en log:", e);
        }
    }
};
