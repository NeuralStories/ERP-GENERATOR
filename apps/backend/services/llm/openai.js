const { OpenAI } = require('openai');
const LLMProvider = require('./base');

/**
 * Adapter para OpenAI.
 */
class OpenAIProvider extends LLMProvider {
    constructor() {
        super();
        this.client = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY || 'missing-key',
        });
        this.defaultModel = process.env.OPENAI_DEFAULT_MODEL || 'gpt-4o';
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
            console.error('OpenAI Stream Error:', error);
            throw error;
        }
    }

    async healthCheck() {
        try {
            if (!process.env.OPENAI_API_KEY) {
                return { available: false, error: 'OPENAI_API_KEY no configurada' };
            }
            // Un check rapido sin gastar muchos tokens o simplemente ver si la clave es valida
            await this.client.models.list();
            return { available: true };
        } catch (error) {
            return { available: false, error: error.message };
        }
    }
}

module.exports = OpenAIProvider;
