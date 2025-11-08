'use client';

import Image from 'next/image';
import axios from 'axios';
import { RealtimeSession } from '@openai/agents-realtime';
import { createAgent } from './agents/gf';
import { KeyboardEvent } from 'react';

export default function Home() {
  async function handleStartAgent() {
    try {
      console.log('Creating ephemeral session via /api');
      const response = await axios.get('/api');
      console.log('Ephemeral response', response.data);

      if (response.data?.error) {
        throw new Error(
          typeof response.data.error === 'string'
            ? response.data.error
            : response.data.error?.message || JSON.stringify(response.data.error)
        );
      }

      const tempKey = response.data?.tempApiKey;
      if (!tempKey) throw new Error('No temporary API key returned from /api');

      const session = new RealtimeSession(await createAgent(), {
        // Keep aligned with /api route
        model: 'gpt-4o-realtime-preview',
        config: {
          inputAudioFormat: 'pcm16',
          inputAudioNoiseReduction: { type: 'near_field' },
          inputAudioTranscription: {
            language: 'en',
            model: 'gpt-4o-mini-transcribe',
          },
        },
      });

      await session.connect({ apiKey: tempKey });
      console.log('Realtime session connected');
    } catch (err) {
      console.error('Failed to start agent session:', err);
      const msg =
        err && typeof err === 'object' && 'response' in err && (err as any).response?.data
          ? `Failed to start agent: ${JSON.stringify((err as any).response.data)}`
          : err instanceof Error
          ? `Failed to start agent: ${err.message}`
          : 'Failed to start agent. Check console for details.';
      alert(msg);
    }
  }

  const handleKey = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleStartAgent();
    }
  };

  return (
    <>
    <header className="w-full px-6 py-4 flex items-center justify-between backdrop-blur-md bg-white/5 border-b border-white/10">
      <div className="flex items-center gap-2 font-bold tracking-wide text-sm">
  <span className="inline-block w-2 h-2 rounded-full bg-linear-to-r from-fuchsia-500 via-pink-500 to-orange-400 animate-pulse" />
        <span className="uppercase text-white/80">Voice Agent</span>
      </div>
      <nav className="hidden md:flex gap-6 text-xs text-white/60">
        <a href="#" className="hover:text-white transition-colors">Home</a>
        <a href="#" className="hover:text-white transition-colors">Docs</a>
      </nav>
    </header>

    <main className="min-h-[calc(100vh-160px)] w-full flex items-center justify-center p-6">
      <div className="glass-panel max-w-4xl w-full grid md:grid-cols-2 gap-10 items-center">
        <div className="space-y-5">
          <h1 className="text-5xl sm:text-6xl font-extrabold tracking-tight hero-gradient">Your Best Buddy</h1>
          <p className="text-base sm:text-lg text-white/70 leading-relaxed">
            Meet your AI companion. Click the avatar to start a realtime conversation.
          </p>
          <div className="hidden md:flex gap-2 text-xs text-white/50">
            <span className="inline-flex items-center gap-1 rounded-full px-2 py-1 bg-white/5 border border-white/10">Realtime</span>
            <span className="inline-flex items-center gap-1 rounded-full px-2 py-1 bg-white/5 border border-white/10">Voice</span>
            <span className="inline-flex items-center gap-1 rounded-full px-2 py-1 bg-white/5 border border-white/10">MCP-ready</span>
          </div>
        </div>

        <div className="flex md:justify-end">
          <div
            role="button"
            tabIndex={0}
            aria-label="Start conversation"
            onClick={handleStartAgent}
            onKeyDown={handleKey}
            className="avatar-wrapper glow-button"
          >
            <span className="pulse-ring" />
            <Image
              src="/lady.svg"
              alt="Assistant avatar"
              fill
              priority
              sizes="(max-width: 768px) 60vw, 320px"
              className="rounded-full object-cover"
            />
          </div>
        </div>
      </div>
    </main>

    <footer className="w-full text-center py-8 text-xs text-white/60 px-6 border-t border-white/10 bg-white/5 backdrop-blur">
      <div>© {new Date().getFullYear()} Your Best Buddy • Built with Next.js and OpenAI Realtime</div>
    </footer>
    </>
  );
}