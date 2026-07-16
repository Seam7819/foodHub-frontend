"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type CarouselItem = {
  id: string;
  image: string;
  title: string;
  description: string;
  link?: string;
};

interface CarouselProps {
  items: CarouselItem[];
  autoPlay?: boolean;
  interval?: number;
  fullViewport?: boolean;
  pauseOnHover?: boolean;
  pauseOnFocus?: boolean;
  allowSpaceToggle?: boolean;
}

const Carousel = ({
  items,
  autoPlay = true,
  interval = 2500,
  fullViewport = false,
  pauseOnHover = true,
  pauseOnFocus = true,
  allowSpaceToggle = true,
}: CarouselProps) => {
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [liveMessage, setLiveMessage] = useState("");

  useEffect(() => {
    if (items.length > 0) {
      const it = items[current] ?? items[0];
      setLiveMessage(`Slide ${current + 1} of ${items.length}: ${it.title}`);
    }

    if (!autoPlay || items.length === 0 || isPaused) return;

    const timer = window.setInterval(() => {
      setCurrent((prev) => (prev + 1) % items.length);
    }, interval);

    return () => window.clearInterval(timer);
  }, [autoPlay, interval, items, current, isPaused]);

  useEffect(() => {
    setCurrent(0);
  }, [items]);

  if (items.length === 0) return null;

  const next = () => setCurrent((prev) => (prev + 1) % items.length);
  const prev = () => setCurrent((prev) => (prev - 1 + items.length) % items.length);

  return (
    <div
      className={`relative w-full ${fullViewport ? "h-screen" : "h-72 sm:h-96"} overflow-hidden rounded-xl bg-gray-900"`}
      role="region"
      aria-label="Homepage carousel"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "ArrowLeft") prev();
        if (e.key === "ArrowRight") next();
        if (allowSpaceToggle && e.key === " ") setIsPaused((p) => !p);
      }}
      onMouseEnter={() => pauseOnHover && setIsPaused(true)}
      onMouseLeave={() => pauseOnHover && setIsPaused(false)}
      onFocus={() => pauseOnFocus && setIsPaused(true)}
      onBlur={() => pauseOnFocus && setIsPaused(false)}
    >
      <span className="sr-only" aria-live="polite">
        {liveMessage}
      </span>

      {items.map((it, idx) => {
        const isActive = idx === current;

        return (
          <div
            key={it.id}
            className={`absolute inset-0 transition-opacity duration-300 ease-in-out ${
              isActive ? "z-10 opacity-100" : "pointer-events-none z-0 opacity-0"
            }`}
            aria-hidden={isActive ? "false" : "true"}
          >
            {it.image ? (
              <img src={it.image} alt={it.title} className="h-full w-full object-cover" />
            ) : (
              <div className="h-full w-full bg-gray-700" />
            )}

            <div className="absolute inset-0 bg-black/45" />

            <div className="absolute inset-0 flex flex-col items-center justify-center px-5 text-center text-white">
              <h2 className="mb-3 text-2xl font-bold sm:text-3xl md:text-4xl lg:text-5xl">{it.title}</h2>
              <p className="mb-6 max-w-2xl text-base sm:text-lg">{it.description}</p>
              {it.link && (
                <Link
                  href={it.link}
                  className="rounded-lg bg-orange-500 px-8 py-3 font-semibold transition hover:bg-orange-600"
                >
                  Explore Now
                </Link>
              )}
            </div>
          </div>
        );
      })}

      {items.length > 1 && (
        <>
          <button
            onClick={prev}
            className="absolute left-5 top-1/2 z-20 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white transition hover:bg-black/70"
            aria-label="Previous slide"
          >
            ←
          </button>
          <button
            onClick={next}
            className="absolute right-5 top-1/2 z-20 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white transition hover:bg-black/70"
            aria-label="Next slide"
          >
            →
          </button>
        </>
      )}

      {items.length > 1 && (
        <div className="absolute bottom-5 left-1/2 z-20 flex -translate-x-1/2 gap-2">
          {items.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrent(index)}
              className={`h-3 w-3 rounded-full transition ${index === current ? "bg-orange-500" : "bg-white/50"}`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Carousel;
