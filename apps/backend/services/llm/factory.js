const providers = {
    lmstudio: null,
    openai: null,
    anthropic: null,
    groq: null,
    ollama: null,
};

/**
 * Factory para obtener instancias de proveedores.
 */
class LLMFactory {
    static getProvider(name) {
        if (name === 'lmstudio' && !providers.lmstudio) {
            const LMStudioProvider = require('./lmstudio');
            providers.lmstudio = new LMStudioProvider();
        }

        if (name === 'openai' && !providers.openai) {
            const OpenAIProvider = require('./openai');
            providers.openai = new OpenAIProvider();
        }

        if (name === 'anthropic' && !providers.anthropic) {
            const AnthropicProvider = require('./anthropic');
            providers.anthropic = new AnthropicProvider();
        }

        if (name === 'groq' && !providers.groq) {
            const OpenAIProvider = require('./openai');
            const Groq = require('openai');
            providers.groq = new OpenAIProvider();
            providers.groq.client = new Groq({
                baseURL: 'https://api.groq.com/openai/v1',
                apiKey: process.env.GROQ_API_KEY || 'missing-key',
            });
            providers.groq.defaultModel = 'llama-3.1-70b-versatile';
        }

        if (name === 'ollama' && !providers.ollama) {
            const OllamaProvider = require('./ollama');
            providers.ollama = new OllamaProvider();
        }

        const provider = providers[name];
        if (!provider) {
            throw new Error(`Proveedor de LLM no soportado: ${name}`);
        }
        return provider;
    }

    static listProviders() {
        return Object.keys(providers);
    }
}

module.exports = LLMFactory;
