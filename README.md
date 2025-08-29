# AI Chat Box with MCP Support

A modern AI chat application built with React.js frontend and Spring Boot backend, featuring Model Context Protocol (MCP) integration.

## Features

- 🤖 AI-powered chat interface
- 🔄 Real-time messaging with WebSocket support
- 🎨 Modern, responsive React UI
- 🚀 Spring Boot REST API backend
- 🔌 Model Context Protocol (MCP) integration
- 📱 Mobile-friendly design
- 🌙 Dark/Light theme support

## Project Structure

```
mcp-poc/
├── frontend/                 # React.js frontend
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── hooks/          # Custom React hooks
│   │   ├── services/       # API services
│   │   └── styles/         # CSS styles
│   └── package.json
├── backend/                 # Spring Boot backend
│   ├── src/main/java/
│   │   └── com/aichat/
│   │       ├── controller/ # REST controllers
│   │       ├── service/    # Business logic
│   │       ├── model/      # Data models
│   │       └── config/     # Configuration
│   └── pom.xml
└── README.md
```

## Quick Start

### Prerequisites

- Node.js (v16 or higher)
- Java 17 or higher
- Maven 3.6+

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Build and run the Spring Boot application:
   ```bash
   mvn spring-boot:run
   ```

The backend will start on `http://localhost:8080`

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

The frontend will start on `http://localhost:3000`

## API Endpoints

- `POST /api/chat` - Send a message and get AI response
- `GET /api/chat/history` - Get chat history
- `DELETE /api/chat/history` - Clear chat history
- `GET /api/mcp/tools` - Get available MCP tools
- `POST /api/mcp/execute` - Execute MCP tool

## MCP Integration

This project integrates with Model Context Protocol to provide:
- File system access
- Web search capabilities
- Code execution
- Database operations
- And more...

## Technologies Used

### Frontend
- React 18
- TypeScript
- Tailwind CSS
- React Query
- Socket.io-client

### Backend
- Spring Boot 3.x
- Spring WebSocket
- Spring Security
- Maven
- Java 17

## License

MIT License - see LICENSE file for details.
