# Postgres Read-Only MCP Server

A FastMCP server that provides AI agents with read-only access to a local PostgreSQL database. It strictly allows `SELECT` queries to inspect data while preventing any modifications.

## 1. Database Setup

Before running the server, you must create a restricted, read-only user in your PostgreSQL database. 

Open your terminal and connect to your database:
```bash
psql -d patient_nutrition_api_development
```
Run the following SQL commands to create the secure role and grant access:

```bash
-- Create the user
CREATE ROLE mcp_reader WITH LOGIN PASSWORD 'mcp_secure_password';

-- Grant basic connection and schema usage
GRANT CONNECT ON DATABASE patient_nutrition_api_development TO mcp_reader;
GRANT USAGE ON SCHEMA public TO mcp_reader;

-- Grant SELECT on all CURRENT tables
GRANT SELECT ON ALL TABLES IN SCHEMA public TO mcp_reader;

-- Automatically grant SELECT on all FUTURE tables
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT ON TABLES TO mcp_reader;
```
Type \q to exit.

## 2. Server Installation
Install dependencies and compile the TypeScript code:

```Bash
npm install
npm run build
```

3. Windsurf Configuration
Add this server to your Windsurf MCP settings to enable the AI to use it.

Open Windsurf.

Go to the MCP Panel and edit your configuration JSON.

Add the following entry:

```bash
{
  "mcpServers": {
    "postgres-reader-mcp": {
      "args": [
        "{{absolut path to the server file}/postgres-reader-mcp/dist/index.js"
      ],
      "command": "node",
      "disabled": false
    }
  }
}
```