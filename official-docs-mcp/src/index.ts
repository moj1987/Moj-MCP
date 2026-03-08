import { FastMCP } from 'fastmcp';
import { z } from 'zod';
import * as cheerio from 'cheerio';
import TurndownService from 'turndown';

const server = new FastMCP({
  name: 'official-docs-mcp',
  version: '1.0.0'
});

const turndownService = new TurndownService();

server.addTool({
  name: 'fetch_official_doc',
  description: 'Fetch and clean official documentation from supported language sites',
  parameters: z.object({
    url: z.string().url('Must provide a valid URL'),
    language: z.enum(['kotlin']).describe('Programming language (currently only Kotlin supported)')
  }),
  execute: async ({ url, language }) => {
    try {
      // Validate URL is from official Kotlin docs
      if (!url.includes('kotlinlang.org')) {
        throw new Error('URL must be from kotlinlang.org for Kotlin documentation');
      }

      // Fetch with timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      const response = await fetch(url, {
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
      
      // Parse and clean HTML
      const $ = cheerio.load(html);
      
      // Try different selectors for Kotlin docs
      let content = '';
      if ($('.devsite-main').length) {
        content = $('.devsite-main').html() || '';
      } else if ($('main').length) {
        content = $('main').html() || '';
      } else if ($('article').length) {
        content = $('article').html() || '';
      } else {
        content = $('body').html() || '';
      }

      if (!content.trim()) {
        throw new Error('No content found on the page');
      }

      // Convert to Markdown
      const markdownContent = turndownService.turndown(content);

      // Return formatted string (FastMCP handles array formatting)
      return `Source: ${url}\nLanguage: ${language}\nFetched: ${new Date().toISOString()}\n\n${markdownContent}`;

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

// Start the server
server.start();