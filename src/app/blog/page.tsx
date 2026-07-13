"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/src/context/AuthContext";
import { getBlogs, deleteBlog } from "@/src/services/blog.service";
import { toast } from "sonner";

type BlogPost = {
  id: string;
  title: string;
  excerpt: string;
  author: string | { id: string; name: string };
  authorId?: string;
  createdAt: string;
};

export default function BlogPage() {
  const { user } = useAuth();
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
    } catch (error: any) {
      console.error(error);
      const message =
        error?.response?.status === 403
          ? "You cannot delete this blog post because you are not the author."
          : error?.response?.data?.message || "Unable to delete blog post.";
      toast.error(message);
    }
  };

  const sortedPosts = useMemo(
    () => [...posts].sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt)),
    [posts]
  );

  return (
    <div className="mx-auto max-w-7xl py-16 px-4 sm:px-6 lg:px-8">
      <div className="mb-10 flex flex-col gap-5 rounded-3xl border border-app bg-surface p-6 sm:p-8 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-3xl">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white sm:text-5xl">Cartora Journal</h1>
          <p className="mt-3 text-base leading-7 text-slate-600 dark:text-slate-300 sm:text-lg">
            Read the latest updates, stories, and announcements from the Cartora community.
          </p>
        </div>

        <Link
          href="/blog/new"
          className="inline-flex shrink-0 items-center justify-center rounded-full bg-(--primary) px-5 py-3 text-sm font-semibold text-white shadow-[0_20px_40px_rgba(15,118,110,0.15)] transition hover:bg-(--primary-strong) sm:px-6 sm:py-4"
        >
          Create Post
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {loading ? (
          <div className="col-span-full rounded-3xl border border-app p-8 bg-surface text-slate-600 sm:px-10 sm:py-10">
            Loading blog posts...
          </div>
        ) : sortedPosts.length === 0 ? (
          <div className="col-span-full rounded-3xl border border-app p-8 bg-surface text-slate-600 sm:px-10 sm:py-10">
            No blog posts found.
          </div>
        ) : (
          sortedPosts.map((post) => (
            <article
              key={post.id}
              className="flex h-full flex-col justify-between overflow-hidden rounded-3xl border border-app bg-surface p-6 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-lg"
            >
              <header className="space-y-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0">
                    <h2 className="text-xl font-semibold text-slate-900 dark:text-white sm:text-2xl truncate">
                      {post.title}
                    </h2>
                    <p className="mt-2 text-sm text-slate-500 dark:text-slate-400 sm:text-sm">
                      By {typeof post.author === "object" ? post.author.name : post.author || "Unknown"} • {new Date(post.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {user?.id === post.authorId && (
                    <>
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
                    </>
                  )}
                </div>
              </header>

              <div className="mt-6 flex-1">
                <p className="text-slate-700 dark:text-slate-300 sm:text-base">{post.excerpt}</p>
              </div>

              <div className="mt-6 flex items-center justify-between gap-4 text-sm text-slate-500 dark:text-slate-400">
                <span className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 dark:bg-slate-800">
                  Blog post
                </span>
                <span>{new Date(post.createdAt).toLocaleDateString()}</span>
              </div>
            </article>
          ))
        )}
      </div>
    </div>
  );
}
