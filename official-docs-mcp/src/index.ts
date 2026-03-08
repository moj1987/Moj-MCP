import { FastMCP } from 'fastmcp';
import { z } from 'zod';
import * as cheerio from 'cheerio';
import TurndownService from 'turndown';
import { search } from 'duck-duck-scrape';

const server = new FastMCP({
  name: 'official-docs-mcp',
  version: '1.0.0'
});

const turndownService = new TurndownService();

server.addTool({
  name: 'fetch_official_doc',
  description: 'Search and clean official documentation from supported language sites',
  parameters: z.object({
    // Replaced 'url' with 'query' and expanded the language enum
    query: z.string().describe('The concept to look up (e.g., "coroutines", "list comprehensions")'),
    language: z.enum(['kotlin', 'ruby', 'python', 'typescript']).describe('Programming language')
  }),
  execute: async ({ query, language }) => {
    try {
      // 1. Search Logic
      const siteConstraints: Record<string, string> = {
        kotlin: "site:kotlinlang.org/docs",
        ruby: "site:docs.ruby-lang.org/en/master",
        python: "site:docs.python.org/3",
        typescript: "site:typescriptlang.org/docs"
      };
      
      const searchQuery = `${siteConstraints[language]} ${query}`;
      const searchResults = await search(searchQuery);
      
      if (!searchResults.results || searchResults.results.length === 0) {
         throw new Error(`No official docs found for query: ${query}`);
      }

      const firstResult = searchResults.results[0];
      
      if (!firstResult) {
        throw new Error(`No official docs found for query: ${query}`);
      }
      
      const targetUrl = firstResult.url;

      // 2. Fetch Logic (from your original code)
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      const response = await fetch(targetUrl, {
        signal: controller.signal,
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; Official-Docs-MCP/1.0.0)'
        }
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`Failed to fetch: ${response.status} ${response.statusText}`);
      }

      const html = await response.text();
      const $ = cheerio.load(html);
      
      // 3. Expanded Selectors for all 4 languages
      let content = '';
      const selectors = ['.devsite-main', 'div.body', 'div.document', '#content', 'article', 'main'];
      
      for (const selector of selectors) {
         if ($(selector).length) {
            content = $(selector).html() || '';
            break;
         }
      }
      
      if (!content) content = $('body').html() || '';

      if (!content.trim()) {
        throw new Error('No content found on the page');
      }

      const markdownContent = turndownService.turndown(content);

      return `Source: ${targetUrl}\nLanguage: ${language}\nFetched: ${new Date().toISOString()}\n\n${markdownContent}`;

    } catch (error) {
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw new Error('Request timed out after 10 seconds');
        }
        throw new Error(`Failed to fetch documentation: ${error.message}`);
      }
      throw new Error('Unknown error occurred while fetching documentation');
    }
  }
});

server.start();