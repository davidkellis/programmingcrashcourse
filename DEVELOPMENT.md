# Development Guide

## Project Overview

This is an interactive programming tutorial application built with Vue 3 and TypeScript. The application provides a multi-language programming learning experience with integrated REPL functionality.

## Project Structure

```
├── frontend-vue/          # Main Vue 3 application
│   ├── src/              # Source code
│   │   ├── components/   # Vue components
│   │   ├── services/     # Business logic and API services
│   │   ├── stores/       # Pinia state management
│   │   ├── types/        # TypeScript type definitions
│   │   ├── views/        # Page components
│   │   └── router/       # Vue Router configuration
│   ├── public/           # Static assets
│   └── package.json      # Frontend dependencies
├── Book/                 # Tutorial content
│   ├── Files/           # Images and assets
│   └── *.md             # Markdown tutorial content
├── package.json          # Root project configuration
└── README.md            # Project documentation
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. Clone the repository
2. Install frontend dependencies:
   ```bash
   npm run install:frontend
   ```

### Development

Start the development server:
```bash
npm run dev
```

The application will be available at http://localhost:5173

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier
- `npm run type-check` - Run TypeScript type checking

## Architecture

### Frontend (Vue 3 + TypeScript)

The application is built with:
- **Vue 3** with Composition API
- **TypeScript** for type safety
- **Vite** for fast development and building
- **Vue Router** for navigation
- **Pinia** for state management
- **ESLint + Prettier** for code quality

### Code Execution

The application uses in-browser code execution:
- **JavaScript**: Native browser execution with MathJS for mathematical operations
- **Python**: Pyodide (Python in WebAssembly)
- **TypeScript**: Compiled to JavaScript and executed
- **Ruby**: Ruby WASM for browser execution

### Content Management

Tutorial content is stored as markdown files in the `Book/` directory and processed by the frontend application. The content service (`localContentService.ts`) handles content loading and organization.

## Development Guidelines

### Code Style

- Use TypeScript for all new code
- Follow Vue 3 Composition API patterns
- Use ESLint and Prettier for code formatting
- Write meaningful commit messages

### Component Structure

- Keep components focused and single-purpose
- Use TypeScript interfaces for props and emits
- Implement proper error handling
- Add comments for complex logic

### State Management

- Use Pinia stores for global state
- Keep component state local when possible
- Use reactive refs for simple state

## Deployment

The application can be deployed as a static site:

1. Build the application:
   ```bash
   npm run build
   ```

2. Deploy the `frontend-vue/dist/` directory to any static hosting service

## Contributing

1. Follow the existing code style and conventions
2. Write tests for new functionality
3. Ensure all supported languages work with new features
4. Test with the target age group (10+ years) in mind
5. Update documentation as needed
