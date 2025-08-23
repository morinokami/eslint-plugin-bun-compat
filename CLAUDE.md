# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is an ESLint plugin that detects and warns about Bun-specific code that is not compatible with Node.js. The plugin is written in TypeScript and uses the modern ESLint flat config format (ESLint 9+).

## Build and Development Commands

```bash
# Build the plugin
bun run build       # Builds with tsdown, outputs to dist/

# Testing
bun run test        # Run tests with Vitest
bun test            # Alternative way to run tests
bun test src/rules/no-bun-imports.test.ts  # Run a single test file

# Type checking
bun run typecheck   # Uses tsgo --noEmit for TypeScript type checking

# Code formatting and linting
bun run lint        # Format and check code with Biome

# Code quality
bun run knip        # Check for unused dependencies and exports
bun run publint     # Lint package.json for publishing issues

# Install dependencies
bun install         # Uses Bun as package manager
```

## Code Formatting

The project uses Biome for formatting and linting:
- Indentation: tabs
- Quote style: double quotes
- Configuration: biome.json
- Files included: `src/**/*`

## Architecture

### Build System
- **tsdown**: Used for building the TypeScript source to ESM format with minification
- Entry point: `src/index.ts`
- Output: `dist/` directory (ESM format with TypeScript declarations)
- Clean build with minification enabled

### TypeScript Configuration
- Target: ESNext
- Module: ESNext with Bundler resolution
- Strict mode enabled
- Allows `.ts` extensions in imports
- Verbatim module syntax enabled

### ESLint Plugin Structure
The plugin exports a flat config plugin with:
- Main entry (`src/index.ts`): Combines rules and configs, reads package.json metadata dynamically
- Rules in `src/rules/` directory
- Recommended config available as `bunCompat.configs.recommended` (sets both rules to "warn")
- Rule creation using `@typescript-eslint/utils` ESLintUtils.RuleCreator

### Testing
- Test framework: Vitest (v3.2.4)
- Rule testing: Uses `@typescript-eslint/rule-tester` with Vitest integration
- Test files: `*.test.ts` alongside rule files
- Testing pattern: RuleTester with valid/invalid test cases
- Vitest integration requires binding RuleTester methods to vitest functions

## Current Rules

### no-bun-imports
Detects imports from "bun" or "bun:*" modules.

**Detection Patterns:**
- Static imports: `import { sql } from "bun"`
- Dynamic imports: `await import("bun:test")`
- CommonJS requires: `require("bun:sqlite")`

**Configuration Options:**
- `allowedModules` (string[]): Array of allowed Bun module names. Supports wildcards (e.g., `bun:*`)

### no-bun-globals
Detects usage of Bun global APIs.

**Detection Patterns:**
- Bun object access: `Bun.serve()`, `Bun.env.NODE_ENV`
- Shell syntax: `$\`echo hello\``
- Constructor calls: `new Bun.Cookie()`
- Destructuring: `const { serve } = Bun`

**Configuration Options:**
- `allowedGlobals` (string[]): Array of allowed Bun global APIs. Supports wildcards (e.g., `Bun.*`)

**Special Handling:**
- TypeScript type annotations are automatically allowed (e.g., `let file: Bun.S3File`)
- Locally defined `Bun` variables are not flagged
- Uses scope analysis to distinguish between global and local variables