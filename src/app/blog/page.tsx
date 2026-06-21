"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { getBlogs, deleteBlog } from "@/src/services/blog.service";
import { toast } from "sonner";

type BlogPost = {
  id: string;
  title: string;
  excerpt: string;
  author: string;
  createdAt: string;
};

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const data = await getBlogs();
        setPosts(data.data || []);
      } catch (error) {
        console.error(error);
        toast.error("Unable to load blog posts.");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const removeBlog = async (id: string) => {
    if (!confirm("Delete this blog post?")) {
      return;
    }

    try {
      await deleteBlog(id);
      setPosts((current) => current.filter((post) => post.id !== id));
      toast.success("Blog deleted.");
    } catch (error) {
      console.error(error);
      toast.error("Unable to delete blog post.");
    }
  };

  const sortedPosts = useMemo(
    () => [...posts].sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt)),
    [posts]
  );

  return (
    <div className="max-w-7xl mx-auto py-16 px-5">
      <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white">OrgNest Insights</h1>
          <p className="mt-2 text-slate-600 dark:text-slate-300">
            Read the latest team and organizational updates.
          </p>
        </div>

        <Link
          href="/blog/new"
          className="inline-flex items-center rounded-full bg-[var(--primary)] px-5 py-3 text-white shadow-lg shadow-[0_20px_40px_rgba(15,118,110,0.15)] hover:bg-[var(--primary-strong)] transition"
        >
          Create Post
        </Link>
      </div>

      <div className="space-y-5">
        {loading ? (
          <div className="rounded-3xl border border-app p-8 bg-surface text-slate-600">
            Loading blog posts...
          </div>
        ) : sortedPosts.length === 0 ? (
          <div className="rounded-3xl border border-app p-8 bg-surface text-slate-600">
            No blog posts found.
          </div>
        ) : (
          sortedPosts.map((post) => (
            <article key={post.id} className="rounded-3xl border border-app bg-surface p-7 shadow-sm">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">{post.title}</h2>
                  <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">By {post.author} • {new Date(post.createdAt).toLocaleDateString()}</p>
                </div>
                <div className="flex gap-2">
                  <Link
                    href={`/blog/edit/${post.id}`}
                    className="rounded-full border border-slate-300 px-4 py-2 text-sm text-slate-700 hover:border-[var(--primary)] hover:text-[var(--primary)] transition"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => removeBlog(post.id)}
                    className="rounded-full border border-rose-300 px-4 py-2 text-sm text-rose-600 hover:bg-rose-50 transition"
                  >
                    Delete
                  </button>
                </div>
              </div>
              <p className="mt-4 text-slate-700 dark:text-slate-300">{post.excerpt}</p>
            </article>
          ))
        )}
      </div>
    </div>
  );
}
