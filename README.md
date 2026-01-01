# ChatNPC with Ollama Integration

A fantasy RPG NPC chat system powered by Ollama for AI-driven conversations.

## Project Structure

```
chatNPC/
├── backend/
│   ├── controllers/
│   │   └── npcController.js    # Main NPC controller
│   ├── service/
│   │   └── ollamaService.js    # Ollama integration service
│   └── server.js               # Express server
├── characteristics.txt         # NPC characteristics and lore
├── .env                       # Environment configuration
├── package.json               # Node.js dependencies
└── test-integration.js        # Integration test script
```

## Setup Instructions

### 1. Install Ollama

Ollama should be installing via snap. Once complete:

```bash
# Verify installation
ollama --version

# Start Ollama service
ollama serve
```

### 2. Install Node.js Dependencies

```bash
npm install
```

### 3. Configure Environment

The `.env` file is already configured with:
- Ollama model: `mistral:latest`
- Server port: `3000`
- NPC characteristics loaded from `characteristics.txt`

### 4. Pull Ollama Model

```bash
ollama pull mistral:latest
```

### 5. Start the Server

```bash
npm start
```

The server will run on `http://localhost:3000`

## API Endpoints

- `GET /` - API information and available endpoints
- `GET /api/health` - Health check
- `GET /api/npc/characteristics` - Get NPC characteristics
- `POST /api/npc/chat` - Send message to NPC
- `POST /api/npc/reset` - Reset conversation history

## Example API Usage

### Send a message to the NPC:

```bash
curl -X POST http://localhost:3000/api/npc/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Hello, I'\''m looking for the sacred stone. Can you help me?",
    "context": []
  }'
```

### Get NPC characteristics:

```bash
curl http://localhost:3000/api/npc/characteristics
```

### Reset conversation:

```bash
curl -X POST http://localhost:3000/api/npc/reset
```

## NPC Character: Horkin

The NPC is named **Horkin**, a gruff but kind village man who:
- Is fearful of danger but faithful in the warrior
- Loves kite flying and may get off-topic
- Knows about the sacred stone legend
- Can be reminded to stay focused

## Conversation Management

The system automatically manages conversation history with persistent storage:

- **Persistent Storage**: Conversations are saved to `data/conversations.json` and persist between server restarts
- **Memory Limit**: Stores up to 10 recent messages plus conversation summaries
- **Automatic Summarization**: When conversation exceeds 10 messages, older messages are summarized
- **Context Preservation**: Summaries maintain key context for coherent long conversations
- **History Reset**: Use `POST /api/npc/reset` to clear all conversation history
- **Conversation Stats**: Use `GET /api/npc/stats` to get conversation statistics
- **Export Data**: Use `GET /api/npc/export` to export conversation data

**How it works:**
1. Each message is stored in persistent JSON file (`data/conversations.json`)
2. When history exceeds 10 messages, the system summarizes the first 5+ messages
3. The summary replaces individual messages, keeping the last 5 messages intact
4. This maintains context while managing memory usage
5. Data directory is excluded from Git to keep conversation data private

**API Endpoints for Conversation Management:**
- `POST /api/npc/reset` - Reset conversation history
- `GET /api/npc/stats` - Get conversation statistics
- `GET /api/npc/export` - Export conversation data

## Troubleshooting

### Ollama Not Found
If `ollama --version` returns "command not found":
1. Wait for the snap installation to complete
2. Try: `sudo snap install ollama`
3. Add snap binaries to PATH if needed

### Model Not Available
If the model fails to load:
1. Ensure Ollama service is running: `ollama serve`
2. Pull the model: `ollama pull mistral:latest`
3. Check available models: `ollama list`

### Node.js Errors
If you get module errors:
1. Reinstall dependencies: `npm install`
2. Check Node.js version (requires v14+)
3. Verify all files are present

## Development

### Running in Development Mode

```bash
npm run dev
```

This uses nodemon for auto-restart on file changes.

### Testing

Run the integration test:

```bash
node test-integration.js
```

## Next Steps

Once Ollama is installed and running:
1. Start the Ollama service
2. Pull the mistral:latest model
3. Start the Node.js server
4. Test the API endpoints
5. Integrate with a frontend client

## License

MIT License
