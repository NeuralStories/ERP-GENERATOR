const LLMFactory = require('./factory');

/**
 * Lógica de Circuit Breaker y Fallback para proveedores de LLM.
 */
async function getAvailableProvider(preferred) {
    const fallbackOrder = ['lmstudio', 'ollama', 'openai', 'groq', 'anthropic'];

    // 1. Intentar el preferido primero
    try {
        const provider = LLMFactory.getProvider(preferred);
        const health = await provider.healthCheck();
        if (health.available) return provider;
        console.warn(`Provider ${preferred} no disponible: ${health.error}`);
    } catch (error) {
        console.warn(`Error al obtener provider ${preferred}: ${error.message}`);
    }

    // 2. Fallback sistematico
    for (const name of fallbackOrder) {
        if (name === preferred) continue;
        try {
            const provider = LLMFactory.getProvider(name);
            const health = await provider.healthCheck();
            if (health.available) {
                console.warn(`Usando FALBACK: ${name}`);
                return provider;
            }
        } catch (error) {
            // Ignorar errores en fallback y seguir al siguiente
        }
    }

    throw new Error('Ningun proveedor de LLM esta disponible en este momento.');
}

module.exports = { getAvailableProvider };
