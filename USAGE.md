# AI Chat with MCP - Usage Guide

## Quick Start

1. **Run the setup script:**
   ```bash
   ./setup.sh
   ```

2. **Open your browser and go to:** `http://localhost:3000`

3. **Start chatting!** The AI will respond to your messages and can use MCP tools when selected.

## Features

### 🤖 AI Chat Interface
- Real-time messaging with AI responses
- Message history persistence
- Session management
- Responsive design for mobile and desktop

### 🔧 MCP Tools Integration
The application supports several MCP tools that can be selected from the sidebar:

#### File System Tool
- **Read files:** Access and read files from the local filesystem
- **Write files:** Create or modify files
- **List directories:** Browse directory contents
- **Check file existence:** Verify if files exist

#### Web Search Tool
- **Search the web:** Get current information from the internet
- **Real-time results:** Access up-to-date information

#### Code Execution Tool
- **Execute code:** Run code in various programming languages
- **Sandboxed environment:** Safe code execution
- **Multiple languages:** Support for Python, JavaScript, Java, etc.

#### Database Tool
- **Query databases:** Execute SQL queries
- **Data manipulation:** Insert, update, delete operations
- **Multiple databases:** Support for various database systems

## Usage Examples

### Basic Chat
```
You: Hello! How can you help me today?
AI: Hello! I can help you with various tasks including file operations, web searches, and code execution through MCP tools.
```

### File Operations
1. **Select the "filesystem" tool** from the sidebar
2. **Ask to read a file:**
   ```
   You: Can you read the file /path/to/myfile.txt?
   AI: I'll use the filesystem tool to read that file for you.
   ```

3. **Ask to list directory contents:**
   ```
   You: Show me what's in the /tmp directory
   AI: I'll use the filesystem tool to list the contents of the /tmp directory.
   ```

### Web Search
1. **Select the "web_search" tool** from the sidebar
2. **Ask for current information:**
   ```
   You: What's the latest news about AI?
   AI: I'll search the web for the latest AI news and provide you with current information.
   ```

### Code Execution
1. **Select the "code_execution" tool** from the sidebar
2. **Ask to run code:**
   ```
   You: Can you run this Python code: print("Hello, World!")
   AI: I'll execute that Python code for you and show you the output.
   ```

### Database Operations
1. **Select the "database" tool** from the sidebar
2. **Ask for database operations:**
   ```
   You: Query the users table to find all active users
   AI: I'll use the database tool to query the users table for active users.
   ```

## API Endpoints

### Chat API
- `POST /api/chat` - Send a message and get AI response
- `GET /api/chat/history?sessionId={id}` - Get chat history
- `GET /api/chat/recent?sessionId={id}&limit={n}` - Get recent messages
- `DELETE /api/chat/history?sessionId={id}` - Clear chat history

### MCP API
- `GET /api/mcp/tools` - Get available MCP tools
- `POST /api/mcp/execute?toolName={name}` - Execute MCP tool
- `GET /api/mcp/tools/{toolName}` - Get specific tool information

## Configuration

### Backend Configuration
The Spring Boot backend configuration is in `backend/src/main/resources/application.yml`:

```yaml
server:
  port: 8080

spring:
  datasource:
    url: jdbc:h2:mem:testdb
    username: sa
    password: password

mcp:
  server:
    url: http://localhost:3001
    timeout: 30000
```

### Frontend Configuration
The React frontend configuration is in `frontend/package.json`:

```json
{
  "proxy": "http://localhost:8080"
}
```

### MCP Server Configuration
The MCP server runs on port 3001 by default. You can change this by setting the `PORT` environment variable.

## Development

### Backend Development
```bash
cd backend
mvn spring-boot:run
```

### Frontend Development
```bash
cd frontend
npm start
```

### MCP Server Development
```bash
cd mcp-server
npm start
```

## Troubleshooting

### Common Issues

1. **Port conflicts:**
   - Backend: Change port in `application.yml`
   - Frontend: Change port in `package.json` or use `PORT=3001 npm start`
   - MCP Server: Use `PORT=3002 npm start`

2. **CORS errors:**
   - Check that the backend CORS configuration allows your frontend origin
   - Verify the proxy setting in `frontend/package.json`

3. **MCP tool not working:**
   - Ensure the MCP server is running on port 3001
   - Check the MCP server logs for errors
   - Verify the tool is properly implemented in the MCP server

4. **Database issues:**
   - Access H2 console at `http://localhost:8080/h2-console`
   - Use JDBC URL: `jdbc:h2:mem:testdb`
   - Username: `sa`, Password: `password`

### Logs
- **Backend logs:** Check the Spring Boot console output
- **Frontend logs:** Check the browser developer console
- **MCP server logs:** Check the Node.js console output

## Security Considerations

1. **File system access:** The filesystem tool can access any file on the system. Use with caution.
2. **Code execution:** Code execution runs in a sandboxed environment but should be monitored.
3. **Database access:** Database operations should be restricted to appropriate databases and users.
4. **Web search:** Web search results should be validated and filtered as needed.

## Extending the Application

### Adding New MCP Tools
1. Implement the tool in `mcp-server/server.js`
2. Add the tool to the `tools` object
3. Update the frontend to recognize the new tool
4. Test the integration

### Customizing the AI Responses
1. Modify the `generateAiResponse` method in `ChatService.java`
2. Add more sophisticated AI logic
3. Integrate with external AI services

### Styling and UI
1. Modify Tailwind CSS classes in React components
2. Update the color scheme in `tailwind.config.js`
3. Add new UI components as needed

## Support

For issues and questions:
1. Check the troubleshooting section above
2. Review the application logs
3. Verify all services are running correctly
4. Test individual components separately
