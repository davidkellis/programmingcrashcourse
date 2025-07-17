# Interactive Programming Tutorial

An interactive web-based programming tutorial that teaches programming concepts to learners aged 10 and older. The tutorial preserves carefully crafted pedagogical content while adding multi-language support and integrated REPL functionality.

## Features

- **Multi-Language Support**: Learn programming concepts in Python, JavaScript, TypeScript, or Ruby
- **Interactive Code Execution**: Send any code snippet to an integrated REPL for immediate execution
- **Preserved Pedagogy**: Maintains the original book's language, analogies, and teaching sequence
- **Safe Execution Environment**: Containerized code execution with security restrictions
- **Progressive Learning**: Structured content with navigation and progress tracking

## Development Setup

### Prerequisites

- Node.js 18+
- Docker and Docker Compose
- npm or yarn

### Quick Start

1. Clone the repository
2. Install dependencies:
   ```bash
   npm run install:all
   ```

3. Start development environment:
   ```bash
   npm run dev
   ```

This will start:
- Frontend React app on http://localhost:5173
- Backend API on http://localhost:3001
- Language runtime containers for code execution

### Using Docker Compose

For a fully containerized development environment:

```bash
docker-compose -f docker-compose.dev.yml up
```

## Project Structure

```
├── frontend/          # React TypeScript frontend
├── backend/           # Node.js/Express API
├── Book/             # Source tutorial content
├── runtime-volumes/  # Docker volumes for code execution
└── docker-compose.dev.yml
```

## Supported Languages

- **Python** - Original tutorial language
- **JavaScript** - Web development focus
- **TypeScript** - Type-safe JavaScript
- **Ruby** - Beginner-friendly syntax

## Development Commands

```bash
# Install all dependencies
npm run install:all

# Start development servers
npm run dev

# Run tests
npm test

# Build for production
npm run build

# Lint code
npm run lint
```

## Architecture

The system consists of:

1. **Content Management System** - Processes tutorial content and manages translations
2. **Code Translation Service** - Converts code examples between languages
3. **Multi-Language REPL Engine** - Provides safe, containerized code execution
4. **Interactive UI** - React-based interface with integrated Monaco Editor

## Contributing

1. Follow the existing code style and conventions
2. Write tests for new functionality
3. Ensure all languages are supported for new code examples
4. Test with the target age group (10+ years) in mind

## License

[License information to be added]
