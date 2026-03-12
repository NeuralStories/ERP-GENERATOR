const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: 'c:/Users/Usuari/Documents/GeneracionNombresERP/apps/frontend/.env' });

const url = process.env.VITE_SUPABASE_URL;
const key = process.env.VITE_SUPABASE_SERVICE_KEY;

console.log('Probando Key para:', url);
console.log('Key empieza por:', key?.substring(0, 10));

const supabase = createClient(url, key);

async function test() {
    try {
        const { data, error } = await supabase.auth.admin.listUsers();
        if (error) {
            console.error('❌ ERROR ADMIN:', error.message);
        } else {
            console.log('✅ KEY VÁLIDA. Usuarios encontrados:', data.users.length);
        }
        process.exit(0);
    } catch (err) {
        console.error('❌ FALLO:', err.message);
        process.exit(1);
    }
}

test();
