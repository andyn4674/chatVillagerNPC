const OllamaService = require('../service/ollamaService');

class NPCController {
  constructor() {
    this.ollamaService = new OllamaService();
    this.conversationHistory = [];
  }

  async initialize() {
    try {
      // Check if the model is available
      const modelAvailable = await this.ollamaService.checkModelAvailability();
      
      if (!modelAvailable) {
        console.log('Model not available, attempting to pull...');
        await this.ollamaService.pullModel(process.env.OLLAMA_MODEL || 'llama2');
      }
      
      console.log('NPC Controller initialized successfully');
    } catch (error) {
      console.error('Error initializing NPC Controller:', error);
      throw error;
    }
  }

  async getResponse(req, res) {
    try {
      const { message, context } = req.body;
      
      if (!message) {
        return res.status(400).json({ 
          error: 'Message is required' 
        });
      }

      // Generate response using Ollama
      const response = await this.ollamaService.generateResponse(
        message, 
        context || []
      );

      // Update conversation history
      this.conversationHistory.push({
        user: message,
        npc: response,
        timestamp: new Date().toISOString()
      });

      // Keep only last 10 messages to manage context
      if (this.conversationHistory.length > 10) {
        this.conversationHistory = this.conversationHistory.slice(-10);
      }

      res.json({
        response: response,
        conversationHistory: this.conversationHistory
      });

    } catch (error) {
      console.error('Error generating NPC response:', error);
      res.status(500).json({
        error: 'Failed to generate response',
        message: error.message
      });
    }
  }

  async getCharacteristics(req, res) {
    try {
      const characteristics = process.env.NPC_CHARACTERISTICS || 
        'Default NPC characteristics not configured';
      
      res.json({
        characteristics: characteristics
      });
    } catch (error) {
      console.error('Error getting characteristics:', error);
      res.status(500).json({
        error: 'Failed to get characteristics'
      });
    }
  }

  async resetConversation(req, res) {
    try {
      this.conversationHistory = [];
      res.json({
        message: 'Conversation history reset successfully'
      });
    } catch (error) {
      console.error('Error resetting conversation:', error);
      res.status(500).json({
        error: 'Failed to reset conversation'
      });
    }
  }
}

module.exports = NPCController;
