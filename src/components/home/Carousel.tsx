"use client";

import { useState, useEffect } from "react";
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
    // update live message for screen readers when slide changes
    if (items.length > 0) {
      const it = items[current];
      setLiveMessage(`Slide ${current + 1} of ${items.length}: ${it.title}`);
    }

    if (!autoPlay || items.length === 0) return;
    if (isPaused) return;

    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % items.length);
    }, interval);

    return () => clearInterval(timer);
  }, [autoPlay, interval, items.length, isPaused]);

  useEffect(() => {
    // reset current when items change
    setCurrent(0);
  }, [items]);

  if (items.length === 0) return null;

  const next = () => setCurrent((prev) => (prev + 1) % items.length);
  const prev = () => setCurrent((prev) => (prev - 1 + items.length) % items.length);

  return (
    <div
      className={`relative w-full ${fullViewport ? "h-screen" : "h-72 sm:h-96"} bg-gray-900 rounded-xl overflow-hidden`}
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
      <span className="sr-only" aria-live="polite">{liveMessage}</span>
      {/* Slides (all rendered, fade between them) */}
      {items.map((it, idx) => (
        <div
          key={it.id}
          className={`absolute inset-0 transition-opacity duration-300 ease-in-out ${
            idx === current ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
          }`}
          aria-hidden={idx === current ? "false" : "true"}
        >
          {it.image ? (
            <img src={it.image} alt={it.title} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-gray-700" />
          )}

          <div className="absolute inset-0 bg-black/40" />

          <div className="absolute inset-0 flex flex-col justify-center items-center text-center text-white px-5">
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3">{it.title}</h2>
              <p className="text-base sm:text-lg mb-6 max-w-2xl">{it.description}</p>
            {it.link && (
              <Link href={it.link} className="px-8 py-3 bg-orange-500 rounded-lg hover:bg-orange-600 font-semibold transition">
                Explore Now
              </Link>
            )}
          </div>
        </div>
      ))}

      {/* Navigation Buttons */}
      {items.length > 1 && (
        <>
          <button
            onClick={prev}
            className="absolute left-5 top-1/2 -translate-y-1/2 z-20 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition"
            aria-label="Previous slide"
          >
            ←
          </button>
          <button
            onClick={next}
            className="absolute right-5 top-1/2 -translate-y-1/2 z-20 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition"
            aria-label="Next slide"
          >
            →
          </button>
        </>
      )}

      {/* Dots Indicator */}
      {items.length > 1 && (
        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2 z-20">
          {items.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrent(index)}
              className={`w-3 h-3 rounded-full transition ${index === current ? "bg-orange-500" : "bg-white/50"}`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Carousel;
