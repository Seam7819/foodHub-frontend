"use client";

import { useEffect, useState } from "react";
import Carousel from "./Carousel";

type ApiMeal = {
  id: string;
  name: string;
  description: string;
  image?: string;
};

const CarouselClient = ({ fullViewport = false, autoPlay = true, interval = 5000, pauseOnHover = true, pauseOnFocus = true, allowSpaceToggle = true }: { fullViewport?: boolean; autoPlay?: boolean; interval?: number; pauseOnHover?: boolean; pauseOnFocus?: boolean; allowSpaceToggle?: boolean; }) => {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    fetch("/api/meals")
      .then((res) => res.json())
      .then((data) => {
        if (!mounted) return;
        const meals: ApiMeal[] = data?.data || [];
        const mapped = meals.slice(0, 5).map((m) => ({
          id: m.id,
          image: m.image || "",
          title: m.name,
          description: m.description,
          link: `/meals/${m.id}`,
        }));
        setItems(mapped);
      })
      .catch(() => {
        setItems([]);
      })
      .finally(() => setLoading(false));

    return () => {
      mounted = false;
    };
  }, []);

  if (loading) return <div className="w-full h-48 sm:h-96 flex items-center justify-center">Loading...</div>;
  if (items.length === 0) return null;

  return <Carousel items={items} autoPlay={autoPlay} interval={interval} fullViewport={fullViewport} pauseOnHover={pauseOnHover} pauseOnFocus={pauseOnFocus} allowSpaceToggle={allowSpaceToggle} />;
};

export default CarouselClient;
