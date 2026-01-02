const OllamaService = require('../service/ollamaService');
const ConversationStorage = require('../../data/conversation');

class NPCController {
  constructor() {
    this.ollamaService = new OllamaService();
    this.conversationStorage = new ConversationStorage();
    this.conversationHistory = this.conversationStorage.getCurrentConversation();
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
        context || [],
        this.conversationHistory.slice(0, -1) // Pass previous conversation history
      );

      // Update conversation history in persistent storage
      this.conversationStorage.addMessage(message, response);
      this.conversationHistory = this.conversationStorage.getCurrentConversation();

      // Check if we need to summarize the conversation
      if (this.conversationHistory.length > 8) {
        await this.summarizeConversation();
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

  async summarizeConversation() {
    try {
      // Get the conversation to summarize (all but the last 5 messages)
      const messagesToSummarize = this.conversationHistory.slice(0, -5);
      const recentMessages = this.conversationHistory.slice(-5);

      if (messagesToSummarize.length === 0) {
        return;
      }

      // Create a summary prompt
      const summaryPrompt = this.createSummaryPrompt(messagesToSummarize);

      // Generate summary using Ollama
      const summary = await this.ollamaService.generateResponse(
        summaryPrompt,
        []
      );

      // Use persistent storage to replace with summary
      this.conversationStorage.replaceWithSummary(summary, recentMessages);
      this.conversationHistory = this.conversationStorage.getCurrentConversation();

      console.log('Conversation summarized. History length:', this.conversationHistory.length);

    } catch (error) {
      console.error('Error summarizing conversation:', error);
      // If summarization fails, just truncate to last 10 messages in storage
      const truncatedHistory = this.conversationHistory.slice(-10);
      this.conversationStorage.setCurrentConversation(truncatedHistory);
      this.conversationHistory = truncatedHistory;
    }
  }

  createSummaryPrompt(messages) {
    let conversationText = "Please provide a concise summary of the following conversation between a player and an NPC. Focus on the key topics discussed, important information shared, and the overall context of their interaction:\n\n";
    
    messages.forEach((message, index) => {
      if (message.type === 'summary') {
        conversationText += `[Summary ${index + 1}]: ${message.content}\n\n`;
      } else {
        conversationText += `Player: ${message.user}\n`;
        conversationText += `NPC: ${message.npc}\n\n`;
      }
    });

    conversationText += "Summary (keep it brief and focused on key points):";

    return conversationText;
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
      // Reset conversation in persistent storage
      this.conversationStorage.resetConversation();
      this.conversationHistory = this.conversationStorage.getCurrentConversation();
      
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

  async getConversationStats(req, res) {
    try {
      const stats = this.conversationStorage.getStatistics();
      res.json(stats);
    } catch (error) {
      console.error('Error getting conversation stats:', error);
      res.status(500).json({
        error: 'Failed to get conversation statistics'
      });
    }
  }

  async exportConversation(req, res) {
    try {
      const conversationData = this.conversationStorage.exportConversation();
      res.json(conversationData);
    } catch (error) {
      console.error('Error exporting conversation:', error);
      res.status(500).json({
        error: 'Failed to export conversation'
      });
    }
  }
}

module.exports = NPCController;
