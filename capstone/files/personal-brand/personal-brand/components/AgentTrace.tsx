'use client';

import { useEffect, useRef, useState } from 'react';

type TraceStep = { kind: 'tool'; label: string } | { kind: 'answer'; text: string };

const BOOT_LINES = [
  '$ agent boot --profile ./data/profile.ts',
  '> tools ready: get_profile, list_projects, get_project',
  '> waiting for input_',
];

const SUGGESTIONS = ['what have you built?', 'what are you learning right now?', 'how do I reach you?'];

export default function AgentTrace() {
  const [bootShown, setBootShown] = useState<number>(0);
  const [question, setQuestion] = useState('');
  const [loading, setLoading] = useState(false);
  const [trace, setTrace] = useState<TraceStep[]>([]);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (bootShown >= BOOT_LINES.length) return;
    const t = setTimeout(() => setBootShown((n) => n + 1), 380);
    return () => clearTimeout(t);
  }, [bootShown]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [trace, loading]);

  async function ask(q: string) {
    if (!q.trim() || loading) return;
    setLoading(true);
    setError(null);
    setTrace((t) => [...t, { kind: 'tool', label: `> query: "${q}"` }]);
    setQuestion('');
    try {
      const res = await fetch('/api/agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: q }),
      });
      if (!res.ok) throw new Error('agent request failed');
      const data = await res.json();
      const steps: TraceStep[] = (data.toolCalls || []).map((c: string) => ({
        kind: 'tool',
        label: `> tool_call: ${c}`,
      }));
      setTrace((t) => [...t, ...steps, { kind: 'answer', text: data.answer }]);
    } catch (e) {
      setError('Could not reach the agent. Is ANTHROPIC_API_KEY set on the server?');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="border border-line rounded-md bg-panel/80 overflow-hidden shadow-[0_0_60px_-15px_rgba(255,180,84,0.15)]">
      <div className="flex items-center gap-1.5 px-4 py-2.5 border-b border-line bg-ink/60">
        <span className="h-2.5 w-2.5 rounded-full bg-[#4a5568]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#4a5568]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#4a5568]" />
        <span className="ml-3 font-mono text-[11px] text-muted">agent.trace — live</span>
        <span className="ml-auto flex items-center gap-1.5 font-mono text-[11px] text-live">
          <span className="h-1.5 w-1.5 rounded-full bg-live" /> connected
        </span>
      </div>

      <div ref={scrollRef} className="px-4 py-4 font-mono text-[13px] leading-relaxed h-64 overflow-y-auto">
        {BOOT_LINES.slice(0, bootShown).map((line, i) => (
          <p key={i} className="trace-line text-muted">
            {line.startsWith('$') ? <span className="text-amber">{line}</span> : line}
          </p>
        ))}

        {trace.map((step, i) =>
          step.kind === 'tool' ? (
            <p key={i} className="trace-line text-cyan">
              {step.label}
            </p>
          ) : (
            <p key={i} className="trace-line text-paper whitespace-pre-wrap mt-1 mb-2">
              {step.text}
            </p>
          )
        )}

        {loading && (
          <p className="text-muted">
            {'> thinking'}
            <span className="cursor-blink">...</span>
          </p>
        )}
        {error && <p className="text-[#ff8080]">! {error}</p>}
      </div>

      <div className="border-t border-line p-3">
        <div className="flex flex-wrap gap-2 mb-2">
          {SUGGESTIONS.map((s) => (
            <button
              key={s}
              onClick={() => ask(s)}
              className="font-mono text-[11px] text-muted border border-line rounded-sm px-2 py-1 hover:text-amber hover:border-amberDim transition-colors"
            >
              {s}
            </button>
          ))}
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            ask(question);
          }}
          className="flex items-center gap-2"
        >
          <span className="font-mono text-amber text-sm">$</span>
          <input
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="ask the agent about me..."
            className="flex-1 bg-transparent font-mono text-sm text-paper placeholder:text-muted/60 outline-none"
          />
        </form>
      </div>
    </div>
  );
}
