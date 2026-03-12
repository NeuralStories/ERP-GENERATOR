const { OpenAI } = require('openai');
const LLMProvider = require('./base');

/**
 * Adapter para Ollama (vía OpenAI compatibility layer).
 */
class OllamaProvider extends LLMProvider {
    constructor() {
        super();
        this.client = new OpenAI({
            baseURL: process.env.OLLAMA_URL || 'http://localhost:11434/v1',
            apiKey: 'ollama',
        });
        console.log(`[Ollama] Cliente inicializado con baseURL: ${this.client.baseURL}`);
        this.defaultModel = process.env.OLLAMA_DEFAULT_MODEL || 'llama-3.1-8b';
    }

    async *stream({ messages, model, temperature }) {
        try {
            const response = await this.client.chat.completions.create({
                model: model || this.defaultModel,
                messages,
                temperature: temperature !== undefined ? temperature : 0.7,
                stream: true,
            });

            for await (const chunk of response) {
                const content = chunk.choices[0]?.delta?.content || '';
                if (content) yield content;
            }
        } catch (error) {
            console.error('[Ollama] Stream Error:', error.message);
            if (error.status) console.error(`[Ollama] HTTP Status: ${error.status}`);
            throw error;
        }
    }

    async healthCheck() {
        try {
            // Ollama a veces tarda en responder a list(), intentamos un fetch simple al base
            const baseUrl = this.client.baseURL;
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 2000);

            // Si el base URL termina en /v1, el server debería responder algo en /v1/models
            const resp = await fetch(`${baseUrl}/models`, { signal: controller.signal });
            clearTimeout(timeoutId);

            return { available: resp.ok };
        } catch (error) {
            return { available: false, error: error.message };
        }
    }
}

module.exports = OllamaProvider;
