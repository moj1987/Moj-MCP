# Project Plan: Official Docs Fetcher (FastMCP TypeScript)

## Goal
Build a local server for Windsurf to fetch, clean, and read official documentation (Kotlin, Ruby, Python, TypeScript) using the FastMCP framework for minimal boilerplate.

## Core Dependencies
- `fastmcp` - Modern, high-level framework for building MCP servers
- `zod` - Input validation and tool schema definition
- `cheerio` - HTML parsing and cleaning
- `turndown` - HTML to Markdown conversion
- *(Note: No `node-fetch` needed; we will use Node's native `fetch()`)*

## Implementation Steps

### 1. Project Initialization
- Initialize Node.js project with TypeScript.
- Install dependencies: `npm i fastmcp zod cheerio turndown`.
- Install types: `npm i -D typescript @types/node @types/cheerio @types/turndown tsx`.
- Configure `tsconfig.json` for Node 18+ (ES2022).

### 2. FastMCP Server Foundation
- Import `FastMCP` and create a server instance: `const server = new FastMCP({ name: "docs-fetcher", version: "1.0.0" });`.
- Start the server using stdio transport: `server.start()`.

### 3. Tool Definition
- Use `server.addTool()` to define `fetch_official_doc`.
- Define Zod schema for inputs: `url` (string) and `language` (enum: kotlin, ruby, python, typescript).

### 4. Content Processing Pipeline
- **Fetch:** Use native `fetch(url)`.
- **Clean:** Use `cheerio` with language-specific CSS selectors (e.g., target `.article-content` instead of generic `<main>` to avoid broken formatting).
- **Convert:** Pass cleaned HTML to `turndown` for Markdown generation.

### 5. Strict MCP Output Format
- Return data in the mandatory MCP array format to prevent Windsurf crashes:
  ```typescript
  return {
    content: [{ 
      type: "text", 
      text: `Source: ${url}\n\n${markdownContent}` 
    }]
  };