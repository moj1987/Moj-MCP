# Official Docs MCP Server

A FastMCP server that fetches and cleans official documentation from Kotlin documentation sites for use with Windsurf.

## Features

- Fetches content from kotlinlang.org
- Cleans HTML using intelligent CSS selectors
- Converts to Markdown for LLM consumption
- 10-second timeout protection
- Proper MCP error handling

## Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Build the project:**
   ```bash
   npm run build
   ```

## Usage

### Development
```bash
npm run dev
```

### Production
```bash
npm start
```

## Windsurf Configuration

Add this server to your Windsurf MCP configuration:

1. Find your Windsurf settings file (usually `~/.windsurf/mcp.json` or similar)
2. Add the following configuration:

```json
{
  "mcpServers": {
    "official-docs-mcp": {
      "command": "node",
      "args": ["/Users/mojsmac/Repos/Moj-MCP/official-docs-mcp/dist/index.js"],
      "env": {}
    }
  }
}
```

**Important:** Update the path to match your actual project location.

## Available Tools

### `fetch_official_doc`

Fetches and cleans official documentation.

**Parameters:**
- `url` (string, required): URL from kotlinlang.org
- `language` (enum, required): Currently only supports "kotlin"

**Example Usage in Windsurf:**
```
Please fetch the Kotlin documentation for coroutines from https://kotlinlang.org/docs/coroutines-overview.html
```

## Development

**Project Structure:**
- `src/index.ts` - Main server implementation
- `dist/` - Compiled JavaScript output
- `package.json` - Dependencies and scripts

**Scripts:**
- `npm run dev` - Development with tsx
- `npm run build` - Compile TypeScript
- `npm start` - Run compiled version

## Dependencies

- `fastmcp` - MCP server framework
- `zod` - Input validation
- `cheerio` - HTML parsing
- `turndown` - HTML to Markdown conversion

## License

ISC
