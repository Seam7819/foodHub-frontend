"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Meal = {
  id: string;
  name: string;
  description: string;
  image?: string;
};

const GalleryClient = ({ columns = 4 }: { columns?: number }) => {
  const [items, setItems] = useState<Meal[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Meal | null>(null);

  useEffect(() => {
    let mounted = true;
    fetch("/api/meals")
      .then((res) => res.json())
      .then((data) => {
        if (!mounted) return;
        setItems(data?.data || []);
      })
      .catch(() => setItems([]))
      .finally(() => setLoading(false));

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelected(null);
    };
    if (selected) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selected]);

  if (loading) return <div className="w-full h-48 flex items-center justify-center">Loading...</div>;
  if (items.length === 0) return null;

  return (
    <>
      <div className="px-4 py-8">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {items.map((m) => (
            <button
              key={m.id}
              onClick={() => setSelected(m)}
              className="group bg-transparent rounded overflow-hidden focus:outline-none"
              aria-label={`Open ${m.name} image`}
            >
              <div className="w-full h-44 bg-gray-200">
                {m.image ? (
                  <img
                    src={m.image}
                    alt={m.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-300" />
                )}
              </div>

              <div className="p-2 text-left">
                <h3 className="text-sm font-semibold text-gray-800">{m.name}</h3>
              </div>
            </button>
          ))}
        </div>
      </div>

      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-label={selected.name}>
          <div className="absolute inset-0 bg-black/60" onClick={() => setSelected(null)} />

          <div className="relative bg-white rounded-lg overflow-hidden max-w-3xl w-full z-10">
            <button
              onClick={() => setSelected(null)}
              className="absolute right-3 top-3 text-white bg-black/40 rounded-full p-1"
              aria-label="Close image dialog"
            >
              ✕
            </button>

            {selected.image && <img src={selected.image} alt={selected.name} className="w-full h-96 object-cover" />}

            <div className="p-4">
              <h2 className="text-xl font-bold mb-2">{selected.name}</h2>
              <p className="text-sm mb-4">{selected.description}</p>
              <Link href={`/meals/${selected.id}`} className="inline-block px-4 py-2 bg-orange-500 text-white rounded">
                View meal
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default GalleryClient;
