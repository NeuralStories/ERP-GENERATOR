const Anthropic = require('@anthropic-ai/sdk');
const LLMProvider = require('./base');

/**
 * Adapter para Anthropic.
 */
class AnthropicProvider extends LLMProvider {
    constructor() {
        super();
        this.client = new Anthropic({
            apiKey: process.env.ANTHROPIC_API_KEY || 'missing-key',
        });
        this.defaultModel = process.env.ANTHROPIC_DEFAULT_MODEL || 'claude-3-5-sonnet-20240620';
    }

    async *stream({ messages, model, temperature }) {
        try {
            // Anthropic requiere separar el system prompt
            const systemMessage = messages.find(m => m.role === 'system');
            const chatMessages = messages.filter(m => m.role !== 'system').map(m => ({
                role: m.role === 'assistant' ? 'assistant' : 'user',
                content: m.content,
            }));

            const stream = await this.client.messages.create({
                model: model || this.defaultModel,
                max_tokens: 4096,
                temperature: temperature !== undefined ? temperature : 0.7,
                system: systemMessage ? systemMessage.content : undefined,
                messages: chatMessages,
                stream: true,
            });

            for await (const event of stream) {
                if (event.type === 'content_block_delta') {
                    yield event.delta.text;
                }
            }
        } catch (error) {
            console.error('Anthropic Stream Error:', error);
            throw error;
        }
    }

    async healthCheck() {
        try {
            if (!process.env.ANTHROPIC_API_KEY) {
                return { available: false, error: 'ANTHROPIC_API_KEY no configurada' };
            }
            // Anthropic no tiene un models.list tan directo para health, 
            // pero podemos asumir disponibilidad si hay API key o hacer un mini-request
            return { available: true };
        } catch (error) {
            return { available: false, error: error.message };
        }
    }
}

module.exports = AnthropicProvider;
