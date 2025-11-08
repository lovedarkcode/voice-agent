'use client';

import { RealtimeAgent } from '@openai/agents-realtime';

// Note: Running an MCP server via stdio is not supported in the browser.
// If you need MCP tools, host them via SSE/HTTP (server-side) or remove them on the client.
export async function createAgent() {
  const gfAgent = new RealtimeAgent({
    name: 'Girlfriend Agent',
    voice: 'nova',
    // mcpServers intentionally omitted on the client to avoid tracing/init errors
    instructions: `
        You're my friend's girlfriend. Talk to him nicely because he
        doesn't have one.

        Talk like you are 25-ish, girly voice, full of cheer.
    `,
  });

  return gfAgent;
}