"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { createBlog } from "@/src/services/blog.service";
import { toast } from "sonner";

export default function CreateBlogPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    // Client-side validation to avoid server-side 400 responses
    if (title.trim().length < 5) {
      toast.error("Title must be at least 5 characters.");
      setLoading(false);
      return;
    }

    if (content.trim().length < 20) {
      toast.error("Content must be at least 20 characters.");
      setLoading(false);
      return;
    }
    try {
      await createBlog({ title, excerpt, content });
      toast.success("Blog post created.");
      router.push("/blog");
    } catch (error: any) {
      console.error(error);

      const htmlResponse =
        typeof error?.response?.data === "string" &&
        error.response.data.trim().startsWith("<!DOCTYPE html>");

      const apiMessage =
        error?.response?.data?.message ||
        (error?.response?.data?.errorDetails &&
          error.response.data.errorDetails.map((d: any) => d.message).join(" \n")) ||
        error?.message ||
        "Unable to create blog post.";

      toast.error(
        htmlResponse
          ? "Blog API route not found. Verify NEXT_PUBLIC_API_URL and that your backend is running."
          : apiMessage
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto py-16 px-5">
      <h1 className="text-4xl font-bold text-slate-900 dark:text-white">New Blog Post</h1>
      <form onSubmit={handleSubmit} className="mt-8 space-y-6 rounded-3xl border border-app bg-surface p-8 shadow-sm">
        <label className="block space-y-2 text-sm text-slate-700 dark:text-slate-300">
          <span>Title</span>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-primary"
            placeholder="Enter blog title"
          />
        </label>

        <label className="block space-y-2 text-sm text-slate-700 dark:text-slate-300">
          <span>Excerpt</span>
          <textarea
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-primary"
            rows={3}
            placeholder="Write a short excerpt"
          />
        </label>

        <label className="block space-y-2 text-sm text-slate-700 dark:text-slate-300">
          <span>Content</span>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-primary"
            rows={8}
            placeholder="Write your blog content here"
          />
        </label>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <button
            type="submit"
            disabled={loading}
            className="rounded-full bg-[var(--primary)] px-6 py-3 text-white shadow-lg shadow-[0_20px_40px_rgba(15,118,110,0.15)] hover:bg-[var(--primary-strong)] transition disabled:opacity-60"
          >
            {loading ? "Saving..." : "Publish Post"}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="rounded-full border border-slate-300 px-6 py-3 text-slate-700 hover:bg-slate-100 transition"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
