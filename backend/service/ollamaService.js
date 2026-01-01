const ollama = require('ollama');

class OllamaService {
  constructor() {
    this.model = process.env.OLLAMA_MODEL || 'llama2';
  }

  async generateResponse(prompt, context = []) {
    try {
      const messages = [
        {
          role: 'system',
          content: `You are an NPC in a fantasy RPG game. Use the following characteristics to guide your responses:

${process.env.NPC_CHARACTERISTICS || 'Default NPC characteristics'}

IMPORTANT RULES:
1. Stay in character at all times
2. Never mention being an AI or language model
3. Respond naturally and conversationally
4. Use the context provided to make responses relevant
5. Keep responses concise and in character`
        },
        ...context,
        {
          role: 'user',
          content: prompt
        }
      ];

      const response = await ollama.chat({
        model: this.model,
        messages: messages,
        stream: false
      });

      return response.message.content;
    } catch (error) {
      console.error('Error generating response from Ollama:', error);
      throw new Error('Failed to generate response from AI model');
    }
  }

  async checkModelAvailability() {
    try {
      const response = await ollama.list();
      const models = response.models;
      const availableModels = models.map(m => m.name);
      
      if (availableModels.includes(this.model)) {
        return true;
      } else {
        console.log(`Model ${this.model} not found. Available models:`, availableModels);
        return false;
      }
    } catch (error) {
      console.error('Error checking model availability:', error);
      return false;
    }
  }

  async pullModel(modelName) {
    try {
      console.log(`Pulling model: ${modelName}`);
      const response = await ollama.pull({
        model: modelName,
      });
      
      console.log('Model pulled successfully:', response);
      return true;
    } catch (error) {
      console.error('Error pulling model:', error);
      throw new Error('Failed to pull model from Ollama');
    }
  }
}

module.exports = OllamaService;
