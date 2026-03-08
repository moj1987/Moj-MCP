# Official Docs MCP Implementation Plan (FastMCP)

Build a TypeScript MCP server using FastMCP framework that fetches and cleans official documentation from Kotlin, Ruby, Python, and TypeScript documentation sites with minimal boilerplate.

## Project Setup
- **Name:** official-docs-mcp
- **Type:** TypeScript project with latest Node.js
- **Framework:** FastMCP for simplified MCP server development

## Core Dependencies
- `fastmcp` - Modern high-level MCP framework
- `zod` - Input validation and tool schema definition
- `cheerio` - HTML parsing and cleaning
- `turndown` - HTML to Markdown conversion
- **Note:** Using Node.js native `fetch()` instead of node-fetch

## Implementation Steps

### 1. Project Initialization
- Initialize Node.js project with TypeScript
- Install dependencies: `npm i fastmcp zod cheerio turndown`
- Install types: `npm i -D typescript @types/node @types/cheerio @types/turndown tsx`
- Configure tsconfig.json for Node 18+ (ES2022)

### 2. FastMCP Server Foundation
- Import FastMCP and create server instance with name and version
- Use `server.start()` to start with stdio transport
- No complex stdio setup needed - FastMCP handles this automatically

### 3. Tool Definition
- Use `server.addTool()` method to define `fetch_official_doc`
- Define Zod schema for inputs:
  - `url` (string, required)
  - `language` (enum: 'kotlin' - starting with Kotlin only)

### 4. Content Processing Pipeline
- **Fetch:** Use native `fetch(url)` with 10-second timeout
- **Clean:** Use cheerio with Kotlin-specific CSS selectors for kotlinlang.org
- **Convert:** Pass cleaned HTML to turndown for Markdown generation

### 5. MCP Output Format
- **FastMCP handles array formatting automatically** - simply return the concatenated string directly from tool execution:
```typescript
return `Source: ${url}\nFetched: ${new Date().toISOString()}\n\n${markdownContent}`;
```

### 6. Error Handling
- **FastMCP handles error formatting automatically** - use standard JavaScript exceptions:
```typescript
throw new Error("Your error message");
```
- Network timeouts: 10 seconds on fetch
- Invalid URLs: Throw meaningful error messages
- Content not found: Clear error responses

### 7. Documentation
- Create README with FastMCP setup instructions
- Add Windsurf MCP configuration guide
- Include FastMCP documentation references
- Provide usage examples

## Key Technical Decisions
- FastMCP framework for simplified MCP development
- FastMCP automatically handles MCP array formatting and error responses
- Kotlin-specific CSS selectors for kotlinlang.org (can extend to other languages later)
- Native Node.js fetch API
- Simple string return format with timestamp for better LLM consumption
- Standard JavaScript exceptions for error handling

## Success Criteria
- Successfully fetch and clean content from Kotlin official docs using FastMCP
- Return simple string with source URL and timestamp (FastMCP handles formatting)
- Handle errors with standard JavaScript exceptions (FastMCP handles MCP error format)
- Integrates properly with Windsurf MCP system
