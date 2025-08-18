# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is an ESLint plugin that detects and warns about Bun-specific code that is not compatible with Node.js. The plugin is written in TypeScript and uses the modern ESLint flat config format (ESLint 9+).

## Build and Development Commands

```bash
# Build the plugin
bun run build       # Builds with tsdown, outputs to dist/

# Type checking
bun run typecheck   # Uses tsgo --noEmit for TypeScript type checking

# Code quality
bun run knip        # Check for unused dependencies and exports
bun run publint     # Lint package.json for publishing issues

# Install dependencies
bun install         # Package manager is specified as pnpm@10.14.0 in package.json
```

## Code Formatting

The project uses Biome for formatting and linting:
- Indentation: tabs
- Quote style: double quotes
- Configuration: biome.json

To format code, use Biome's formatter which is configured in biome.json.

## Architecture

### Build System
- **tsdown**: Used for building the TypeScript source to ESM format with minification
- Entry point: `src/index.ts`
- Output: `dist/` directory (ESM format with TypeScript declarations)

### TypeScript Configuration
- Target: ESNext
- Module: ESNext with Bundler resolution
- Strict mode enabled
- Allows `.ts` extensions in imports

### ESLint Plugin Structure
The plugin should follow the standard ESLint plugin architecture:
- Export rules from `src/index.ts`
- Use `@typescript-eslint/utils` for rule creation and testing
- Compatible with ESLint 9+ flat config format

### Testing
- Test framework: Vitest (v3.2.4) is installed but no test files exist yet
- Rule testing: `@typescript-eslint/rule-tester` is available for testing ESLint rules

## Dependencies
- **@typescript-eslint/utils**: Core utilities for TypeScript ESLint rule development
- **@typescript-eslint/parser** and **@typescript-eslint/rule-tester**: Available in devDependencies for testing