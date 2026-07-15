"use client";

import { useState } from "react";
import { toast } from "sonner";

const NewsletterCTA = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 600));
      toast.success("Thanks for joining the Cartora updates.");
      setEmail("");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-16">
      <div className="mx-auto max-w-7xl px-5">
        <div className="rounded-[2rem] border border-orange-200 bg-gradient-to-r from-orange-600 to-amber-500 px-6 py-10 text-white shadow-sm sm:px-10 lg:px-14">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <p className="text-sm font-semibold uppercase tracking-[0.35em] text-orange-100">Stay in the loop</p>
              <h2 className="mt-3 text-2xl font-bold sm:text-3xl">
                Get product launches, provider updates, and marketplace news.
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="flex w-full max-w-xl flex-col gap-3 sm:flex-row">
              <input
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full rounded-full border border-white/30 bg-white px-5 py-3 text-slate-900 outline-none"
              />
              <button type="submit" disabled={loading} className="rounded-full bg-white dark:bg-slate-950 px-5 py-3 font-semibold text-orange-600 dark:text-white transition hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-70">
                {loading ? "Joining..." : "Subscribe"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NewsletterCTA;
