"use client";

import { useState, useRef, useEffect } from "react";

type Message = { role: "user" | "assistant"; content: string };

const STARTER_MSGS: Message[] = [
  {
    role: "assistant",
    content:
      "Hi! I'm Bappaditya's AI assistant. Ask me about his skills, projects, availability, or how to hire him.",
  },
];

const QUICK = [
  "What ETL tools does he use?",
  "Tell me about his AI projects",
  "Is he available for freelance?",
  "What's his tech stack?",
];

export function ChatSection() {
  const [messages, setMessages] = useState<Message[]>(STARTER_MSGS);
  const [input,    setInput]    = useState("");
  const [loading,  setLoading]  = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const send = async (text: string) => {
    const content = text.trim();
    if (!content || loading) return;

    const updated: Message[] = [...messages, { role: "user", content }];
    setMessages(updated);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/agents/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: updated }),
      });
      const data = await res.json();
      setMessages([...updated, { role: "assistant", content: data.reply }]);
    } catch {
      setMessages([
        ...updated,
        { role: "assistant", content: "Sorry, I hit an error. Try again in a moment." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="chat" className="py-20 bg-surface/30">
      <div className="max-w-3xl mx-auto px-6">
        <p className="text-dim font-mono text-xs text-center tracking-widest uppercase mb-2">
          Ask anything
        </p>
        <h2 className="text-2xl font-medium text-center text-white/90 mb-8">
          Chat with my AI assistant
        </h2>

        {/* Chat box */}
        <div className="glass rounded-xl overflow-hidden">
          {/* Messages */}
          <div className="p-5 flex flex-col gap-4 min-h-[280px] max-h-[380px] overflow-y-auto">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`flex gap-3 items-start ${m.role === "user" ? "flex-row-reverse" : ""}`}
              >
                {/* Avatar */}
                <div className={`w-7 h-7 rounded-full flex items-center justify-center
                                  text-[10px] font-mono flex-shrink-0 mt-0.5 border
                                  ${m.role === "assistant"
                                    ? "bg-teal-dark/30 border-teal/30 text-teal-light"
                                    : "bg-violet-dark/30 border-violet/30 text-violet-light"}`}>
                  {m.role === "assistant" ? "AI" : "U"}
                </div>
                {/* Bubble */}
                <div className={`max-w-[80%] rounded-xl px-4 py-2.5 text-sm leading-relaxed border
                                  ${m.role === "assistant"
                                    ? "bg-void border-border text-muted"
                                    : "bg-violet-dark/20 border-violet/20 text-violet-light"}`}>
                  {m.content}
                </div>
              </div>
            ))}

            {/* Loading dots */}
            {loading && (
              <div className="flex gap-3 items-start">
                <div className="w-7 h-7 rounded-full flex items-center justify-center
                                text-[10px] font-mono flex-shrink-0 bg-teal-dark/30
                                border border-teal/30 text-teal-light">
                  AI
                </div>
                <div className="bg-void border border-border rounded-xl px-4 py-3 flex gap-1.5">
                  {[0, 1, 2].map((i) => (
                    <span
                      key={i}
                      className="w-1.5 h-1.5 rounded-full bg-teal-light/60 animate-bounce"
                      style={{ animationDelay: `${i * 0.15}s` }}
                    />
                  ))}
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Quick prompts */}
          <div className="px-5 pb-3 flex gap-2 flex-wrap border-t border-border pt-3">
            {QUICK.map((q) => (
              <button
                key={q}
                onClick={() => send(q)}
                className="text-[10px] font-mono border border-border text-dim
                           px-2.5 py-1 rounded-full hover:border-teal/40 hover:text-teal-light
                           transition-all"
              >
                {q}
              </button>
            ))}
          </div>

          {/* Input */}
          <div className="flex gap-2 p-4 border-t border-border">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send(input)}
              placeholder="Ask about projects, skills, availability..."
              className="flex-1 bg-void border border-border rounded-lg px-4 py-2.5
                         text-sm text-white/90 placeholder:text-dim outline-none
                         focus:border-teal/40 transition-colors"
            />
            <button
              onClick={() => send(input)}
              disabled={loading}
              className="bg-teal text-white text-sm px-5 py-2.5 rounded-lg
                         hover:bg-teal-dark transition-all disabled:opacity-40"
            >
              Send
            </button>
          </div>
        </div>

        <p className="text-center text-dim text-xs font-mono mt-3">
          Powered by Groq · RAG over resume & project docs
        </p>
      </div>
    </section>
  );
}
