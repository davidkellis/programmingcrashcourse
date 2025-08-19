# Interactive Programming Tutorial

An interactive web-based programming tutorial that teaches programming concepts to learners aged 10 and older. The tutorial preserves carefully crafted pedagogical content while adding multi-language support and integrated REPL functionality.

## Features

- **Multi-Language Support**: Learn programming concepts in Python, JavaScript, TypeScript, or Ruby
- **Interactive Code Execution**: Send any code snippet to an integrated REPL for immediate execution
- **Preserved Pedagogy**: Maintains the original book's language, analogies, and teaching sequence
- **Safe Execution Environment**: Containerized code execution with security restrictions
- **Progressive Learning**: Structured content with navigation and progress tracking
- **Modern Vue.js Interface**: Clean, responsive UI built with Vue 3 and TypeScript

## Development Setup

### Prerequisites

- Node.js 18+
- npm or yarn

### Quick Start

1. Clone the repository
2. Install dependencies:
   ```bash
   npm run install:frontend
   ```

3. Start development environment:
   ```bash
   npm run dev
   ```

This will start the Vue.js frontend application on http://localhost:5173

## Project Structure

```
├── frontend-vue/      # Vue 3 + TypeScript frontend application
│   ├── src/          # Source code
│   ├── public/       # Static assets
│   └── package.json  # Frontend dependencies
├── Book/             # Source tutorial content and images
│   ├── Files/        # Tutorial images and assets
│   └── *.md          # Markdown tutorial content
├── package.json      # Root project configuration
└── README.md         # This file
```

## Supported Languages

- **Python** - Original tutorial language
- **JavaScript** - Web development focus
- **TypeScript** - Type-safe JavaScript
- **Ruby** - Beginner-friendly syntax

## Development Commands

```bash
# Install frontend dependencies
npm run install:frontend

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint

# Format code
npm run format

# Type checking
npm run type-check
```

## Architecture

The system consists of:

1. **Content Management System** - Processes tutorial content and manages translations
2. **Code Translation Service** - Converts code examples between languages
3. **Multi-Language REPL Engine** - Provides safe, containerized code execution
4. **Interactive UI** - Vue.js-based interface with integrated Monaco Editor

## Technology Stack

- **Frontend**: Vue 3, TypeScript, Vite
- **UI Components**: Custom Vue components
- **Code Execution**: MathJS for JavaScript, WASM-based runtimes for other languages
- **Content**: Markdown with custom processing
- **Styling**: CSS with modern design principles

## Contributing

1. Follow the existing code style and conventions
2. Write tests for new functionality
3. Ensure all languages are supported for new code examples
4. Test with the target age group (10+ years) in mind
5. Use TypeScript for type safety

## License

[License information to be added]
