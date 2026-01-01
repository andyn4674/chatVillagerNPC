const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const NPCController = require('./controllers/npcController');

// Load environment variables
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize NPC Controller
const npcController = new NPCController();

async function startServer() {
  try {
    // Initialize the NPC controller
    await npcController.initialize();

    // Routes
    app.post('/api/npc/chat', (req, res) => npcController.getResponse(req, res));
    app.get('/api/npc/characteristics', (req, res) => npcController.getCharacteristics(req, res));
    app.post('/api/npc/reset', (req, res) => npcController.resetConversation(req, res));

    // Health check endpoint
    app.get('/api/health', (req, res) => {
      res.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        model: process.env.OLLAMA_MODEL || 'llama2'
      });
    });

    // Root endpoint
    app.get('/', (req, res) => {
      res.json({
        message: 'ChatNPC API with Ollama Integration',
        endpoints: {
          'POST /api/npc/chat': 'Send message to NPC',
          'GET /api/npc/characteristics': 'Get NPC characteristics',
          'POST /api/npc/reset': 'Reset conversation history',
          'GET /api/health': 'Health check'
        }
      });
    });

    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
      console.log(`Ollama model: ${process.env.OLLAMA_MODEL || 'llama2'}`);
    });

  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

// Start the server
startServer();
