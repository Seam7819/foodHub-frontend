"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

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
}

const Carousel = ({
  items,
  autoPlay = true,
  interval = 5000,
}: CarouselProps) => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!autoPlay || items.length === 0) return;

    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % items.length);
    }, interval);

    return () => clearInterval(timer);
  }, [autoPlay, interval, items.length]);

  if (items.length === 0) return null;

  const next = () => setCurrent((prev) => (prev + 1) % items.length);
  const prev = () =>
    setCurrent((prev) => (prev - 1 + items.length) % items.length);

  const item = items[current];

  return (
    <div className="relative w-full h-96 bg-gray-900 rounded-xl overflow-hidden">
      {/* Main Image */}
      <div className="relative w-full h-full">
        {item.image ? (
          <img
            src={item.image}
            alt={item.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gray-700" />
        )}

        {/* Overlay */}
        <div className="absolute inset-0 bg-black/40" />

        {/* Content */}
        <div className="absolute inset-0 flex flex-col justify-center items-center text-center text-white px-5">
          <h2 className="text-4xl font-bold mb-3">{item.title}</h2>
          <p className="text-lg mb-6 max-w-2xl">{item.description}</p>
          {item.link && (
            <Link
              href={item.link}
              className="px-8 py-3 bg-orange-500 rounded-lg hover:bg-orange-600 font-semibold transition"
            >
              Explore Now
            </Link>
          )}
        </div>
      </div>

      {/* Navigation Buttons */}
      {items.length > 1 && (
        <>
          <button
            onClick={prev}
            className="absolute left-5 top-1/2 -translate-y-1/2 z-10 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition"
            aria-label="Previous slide"
          >
            ←
          </button>
          <button
            onClick={next}
            className="absolute right-5 top-1/2 -translate-y-1/2 z-10 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition"
            aria-label="Next slide"
          >
            →
          </button>
        </>
      )}

      {/* Dots Indicator */}
      {items.length > 1 && (
        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {items.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrent(index)}
              className={`w-3 h-3 rounded-full transition ${
                index === current ? "bg-orange-500" : "bg-white/50"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Carousel;
