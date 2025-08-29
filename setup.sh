#!/bin/bash

echo "🚀 Setting up AI Chat with MCP Support"
echo "======================================"

# Check if required tools are installed
check_requirements() {
    echo "Checking requirements..."
    
    if ! command -v java &> /dev/null; then
        echo "❌ Java is not installed. Please install Java 17 or higher."
        exit 1
    fi
    
    if ! command -v node &> /dev/null; then
        echo "❌ Node.js is not installed. Please install Node.js 16 or higher."
        exit 1
    fi
    
    if ! command -v npm &> /dev/null; then
        echo "❌ npm is not installed. Please install npm."
        exit 1
    fi
    
    echo "✅ All requirements met!"
}

# Setup backend
setup_backend() {
    echo "📦 Setting up Spring Boot backend..."
    cd backend
    
    echo "Installing Maven dependencies..."
    ./mvnw clean install -DskipTests
    
    echo "✅ Backend setup complete!"
    cd ..
}

# Setup frontend
setup_frontend() {
    echo "📦 Setting up React frontend..."
    cd frontend
    
    echo "Installing npm dependencies..."
    npm install --legacy-peer-deps
    
    echo "✅ Frontend setup complete!"
    cd ..
}

# Setup MCP server
setup_mcp_server() {
    echo "📦 Setting up MCP server..."
    cd mcp-server
    
    echo "Installing npm dependencies..."
    npm install --legacy-peer-deps
    
    echo "✅ MCP server setup complete!"
    cd ..
}

# Start all services
start_services() {
    echo "🚀 Starting all services..."
    
    # Start MCP server in background
    echo "Starting MCP server on port 3001..."
    cd mcp-server
    npm start &
    MCP_PID=$!
    cd ..
    
    # Wait a moment for MCP server to start
    sleep 3
    
    # Start Spring Boot backend in background
    echo "Starting Spring Boot backend on port 8080..."
    cd backend
    ./mvnw spring-boot:run &
    BACKEND_PID=$!
    cd ..
    
    # Wait a moment for backend to start
    sleep 10
    
    # Start React frontend
    echo "Starting React frontend on port 3002..."
    cd frontend
    PORT=3002 npm start &
    FRONTEND_PID=$!
    cd ..
    
    echo ""
    echo "🎉 All services started successfully!"
    echo ""
    echo "📱 Frontend: http://localhost:3002"
    echo "🔧 Backend API: http://localhost:8080"
    echo "🔌 MCP Server: http://localhost:3001"
    echo "🗄️  H2 Database Console: http://localhost:8080/h2-console"
    echo ""
    echo "Press Ctrl+C to stop all services"
    
    # Wait for interrupt signal
    trap "echo 'Stopping services...'; kill $MCP_PID $BACKEND_PID $FRONTEND_PID 2>/dev/null; exit" INT
    wait
}

# Main execution
main() {
    check_requirements
    setup_backend
    setup_frontend
    setup_mcp_server
    start_services
}

# Run main function
main
