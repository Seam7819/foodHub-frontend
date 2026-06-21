"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getBlogById, updateBlog } from "@/src/services/blog.service";
import { toast } from "sonner";

export default function EditBlogPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);
  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!id) return;

    const load = async () => {
      setLoading(true);
      try {
        const data = await getBlogById(id);
        setTitle(data.data.title || "");
        setExcerpt(data.data.excerpt || "");
        setContent(data.data.content || "");
      } catch (error) {
        console.error(error);
        toast.error("Failed to load blog post.");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [id]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!id) return;

    setLoading(true);
    try {
      await updateBlog(id, { title, excerpt, content });
      toast.success("Blog post updated.");
      router.push("/blog");
    } catch (error) {
      console.error(error);
      toast.error("Unable to update blog post.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto py-16 px-5">
      <h1 className="text-4xl font-bold text-slate-900 dark:text-white">Edit Blog Post</h1>
      <form onSubmit={handleSubmit} className="mt-8 space-y-6 rounded-3xl border border-app bg-surface p-8 shadow-sm">
        <label className="block space-y-2 text-sm text-slate-700 dark:text-slate-300">
          <span>Title</span>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-primary"
            placeholder="Blog title"
          />
        </label>

        <label className="block space-y-2 text-sm text-slate-700 dark:text-slate-300">
          <span>Excerpt</span>
          <textarea
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-primary"
            rows={3}
            placeholder="Blog excerpt"
          />
        </label>

        <label className="block space-y-2 text-sm text-slate-700 dark:text-slate-300">
          <span>Content</span>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-primary"
            rows={8}
          />
        </label>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <button
            type="submit"
            disabled={loading}
            className="rounded-full bg-(--primary) px-6 py-3 text-white shadow-[0_20px_40px_rgba(15,118,110,0.15)] hover:bg-(--primary-strong) transition disabled:opacity-60"
          >
            {loading ? "Saving..." : "Save Changes"}
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
