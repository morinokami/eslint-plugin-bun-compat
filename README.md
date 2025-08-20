# eslint-plugin-bun-compat

Detects and warns about Bun-specific code that is not compatible with Node.js.


## Usage

### Installation

```sh
npm install -D eslint-plugin-bun-compat
```

### Configuration

```js
// eslint.config.js
import { defineConfig } from "eslint/config";
import bunCompat from "eslint-plugin-bun-compat";

export default defineConfig([
	{ ...bunCompat.configs.recommended },
]);
```


## Rules

### `no-bun-imports`

Warns about `bun:*` imports.

**Options:**
- `allowedModules` (string[]): Allow specific Bun modules. Supports wildcards (`bun:*`).

```js
// Example: Allow bun:test
"bun-compat/no-bun-imports": ["error", {
	allowedModules: ["bun:test"]
}]
```
