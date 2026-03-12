/**
 * @abstract
 * Clase base para proveedores de LLM.
 */
class LLMProvider {
    /**
     * Genera una respuesta en streaming.
     * @abstract
     * @param {Object} options
     * @param {Array} options.messages - Mensajes en formato OpenAI.
     * @param {string} [options.model] - Nombre del modelo.
     * @param {number} [options.temperature] - Temperatura de generación.
     * @yields {string} Tokens generados.
     */
    async *stream({ messages, model, temperature }) {
        throw new Error('Metodo stream() debe ser implementado por la subclase');
    }

    /**
     * Obtiene una respuesta completa consumiendo el stream.
     * @param {Object} options - Igual que stream().
     * @returns {Promise<string>} La respuesta completa.
     */
    async chat(options) {
        let fullText = '';
        for await (const token of this.stream(options)) {
            fullText += token;
        }
        return fullText;
    }

    /**
     * Verifica la disponibilidad del proveedor.
     * @abstract
     * @returns {Promise<{ available: boolean, error?: string }>}
     */
    async healthCheck() {
        return { available: false, error: 'Metodo healthCheck() no implementado' };
    }
}

module.exports = LLMProvider;
