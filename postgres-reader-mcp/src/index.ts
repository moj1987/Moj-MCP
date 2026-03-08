import { FastMCP } from 'fastmcp';
import { Client } from 'pg';
import { z } from 'zod';

const server = new FastMCP({
  name: 'postgres-reader-mcp',
  version: '1.0.0'
});

const dbConfig = {
  user: 'mcp_reader',
  password: 'mcp_secure_password',
  host: 'localhost',
  port: 5432,
  database: 'patient_nutrition_api_development',
};

server.addTool({
  name: 'run_select_query',
  description: 'Run a read-only SELECT query against the local PostgreSQL database to inspect data',
  parameters: z.object({
    query: z.string().describe('The SQL SELECT query to execute')
  }),
  execute: async ({ query }) => {
    // Quick code-level sanity check before hitting the DB
    if (!query.trim().toUpperCase().startsWith('SELECT')) {
      throw new Error("Only SELECT queries are allowed.");
    }

    const client = new Client(dbConfig);
    try {
      await client.connect();
      const result = await client.query(query);
      return JSON.stringify(result.rows, null, 2);
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Database error: ${error.message}`);
      }
      throw new Error("Unknown database error occurred");
    } finally {
      await client.end();
    }
  }
});

server.start();