"use client";

import { useState } from "react";
import { getAiAssistantReply } from "@/src/services/assistant.service";
import { toast } from "sonner";

export default function AssistantPage() {
  const [query, setQuery] = useState("");
  const [reply, setReply] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!query.trim()) {
      toast.error("Ask something about food or orders.");
      return;
    }

    setLoading(true);
    try {
      const data = await getAiAssistantReply(query.trim());
      setReply(data.answer || "Sorry, I couldn't find an answer.");
    } catch (error) {
      console.error(error);
      toast.error("AI assistant request failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto py-16 px-5">
      <div className="rounded-3xl border border-app bg-surface p-8 shadow-sm">
        <h1 className="text-4xl font-bold text-slate-900 dark:text-white">AI Assistant</h1>
        <p className="mt-3 text-slate-600 dark:text-slate-300">
          Ask questions about services, teams, projects, or the FoodHub workflow.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <textarea
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            rows={5}
            placeholder="Ask me something like 'How can I track my order?' or 'What meals are best for lunch?'"
            className="w-full rounded-3xl border border-slate-300 bg-white px-4 py-4 text-slate-900 outline-none transition focus:border-[var(--primary)]"
          />

          <button
            type="submit"
            disabled={loading}
            className="rounded-full bg-[var(--primary)] px-6 py-3 text-white shadow-lg shadow-[0_20px_40px_rgba(15,118,110,0.15)] hover:bg-[var(--primary-strong)] transition disabled:opacity-60"
          >
            {loading ? "Thinking..." : "Ask Assistant"}
          </button>
        </form>

        {reply && (
          <div className="mt-8 rounded-3xl border border-app bg-surface-muted p-6 text-slate-800 dark:text-slate-200">
            <h2 className="text-xl font-semibold mb-3">Assistant answer</h2>
            <p className="whitespace-pre-line">{reply}</p>
          </div>
        )}
      </div>
    </div>
  );
}
