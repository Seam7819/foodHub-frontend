"use client";

import { useEffect, useState } from "react";
import Carousel from "./Carousel";

type ApiProduct = {
  id: string;
  name: string;
  description: string;
  image?: string;
  availableItems?: number | null;
  isAvailable?: boolean | null;
};

const isProductAvailable = (product: ApiProduct) => {
  if (typeof product.availableItems === "number") {
    return product.availableItems > 0;
  }

  if (typeof product.isAvailable === "boolean") {
    return product.isAvailable;
  }

  return true;
};

const CarouselClient = ({
  fullViewport = false,
  autoPlay = true,
  interval = 5000,
  pauseOnHover = true,
  pauseOnFocus = true,
  allowSpaceToggle = true,
}: {
  fullViewport?: boolean;
  autoPlay?: boolean;
  interval?: number;
  pauseOnHover?: boolean;
  pauseOnFocus?: boolean;
  allowSpaceToggle?: boolean;
}) => {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    fetch("/api/products")
      .then((res) => res.json())
      .then((data) => {
        if (!mounted) return;

        const sourceProducts: ApiProduct[] = Array.isArray(data?.data) ? data.data : [];
        const availableProducts = sourceProducts.filter(isProductAvailable);
        const fallbackProducts: ApiProduct[] = sourceProducts.slice(0, 5);
        const selectedProducts = availableProducts.length >= 4
          ? availableProducts.slice(0, 5)
          : (availableProducts.length > 0 ? availableProducts : fallbackProducts);

        const mapped = selectedProducts.map((product) => ({
          id: product.id,
          image: product.image || "",
          title: product.name,
          description: product.description,
          link: `/products/${product.id}`,
        }));

        setItems(mapped);
      })
      .catch(() => {
        setItems([]);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  if (loading) {
    return <div className="flex h-48 w-full items-center justify-center sm:h-96">Loading...</div>;
  }

  if (items.length === 0) return null;

  return (
    <Carousel
      items={items}
      autoPlay={autoPlay}
      interval={interval}
      fullViewport={fullViewport}
      pauseOnHover={pauseOnHover}
      pauseOnFocus={pauseOnFocus}
      allowSpaceToggle={allowSpaceToggle}
    />
  );
};

export default CarouselClient;
