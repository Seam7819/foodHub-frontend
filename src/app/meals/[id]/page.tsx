"use client";

import { useRouter } from "next/navigation";
import { use, useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getSingleMeal } from "@/src/services/meal.service";
import {
  addWishlistItem,
  getWishlistItems,
  removeWishlistItem,
  WishlistItem,
} from "@/src/services/wishlist.service";
import { addToCart as addCartItemServer } from "@/src/services/cart.service";
import { addCartItem } from "@/src/utils/cart";
import {
  createReview,
  getMealReviews,
  Review,
} from "@/src/services/review.service";
import { IMeal } from "@/src/types/meal.types";
import Loader from "@/src/components/shared/Loader";
import { useAuth } from "@/src/context/AuthContext";

export default function MealDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [authLoading, user, router]);

  const {
    data,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["meal", id],
    queryFn: () => getSingleMeal(id),
  });

  const [added, setAdded] = useState(false);
  const [wishlisted, setWishlisted] = useState(false);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewForm, setReviewForm] = useState({
    rating: 5,
    comment: "",
  });
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  useEffect(() => {
    setAdded(false);
    setWishlisted(
      user
        ? getWishlistItems(user.id).some((item: WishlistItem) => item.id === id)
        : false
    );

    const loadReviews = async () => {
      const res = await getMealReviews(id);
      setReviews(res.data || []);
    };

    loadReviews();
  }, [id, user?.id]);

  const meal = data?.data;

  const averageRating = useMemo(() => {
    if (!meal || reviews.length === 0) return meal?.averageRating || 0;
    return (
      (
        reviews.reduce((sum, review) => sum + review.rating, 0) /
        reviews.length
      )
    ).toFixed(1);
  }, [meal, meal?.averageRating, reviews]);

  if (authLoading) return <Loader />;

  if (isLoading) return <Loader />;
  if (isError)
    return (
      <div className="max-w-7xl mx-auto py-10 px-5">
        Failed to load meal.
      </div>
    );

  if (!meal) {
    return (
      <div className="max-w-7xl mx-auto py-10 px-5">
        Meal not found.
      </div>
    );
  }

  const addToCart = async () => {
    if (!user) {
      router.push("/login");
      return;
    }

    addCartItem(
      {
        id: meal.id,
        name: meal.name,
        price: meal.price,
        image: meal.image,
        quantity: 1,
      },
      user.id
    );

    try {
      await addCartItemServer({
        mealId: meal.id,
        quantity: 1,
      });
    } catch (error) {
      console.warn("Server cart sync failed:", error);
    }

    setAdded(true);
    window.dispatchEvent(new Event("foodhub_cart_update"));
  };

  const toggleWishlist = () => {
    if (!user) {
      router.push("/login");
      return;
    }

    if (wishlisted) {
      removeWishlistItem(meal.id, user?.id);
      setWishlisted(false);
    } else {
      addWishlistItem(
        {
          id: meal.id,
          name: meal.name,
          price: meal.price,
          image: meal.image,
        },
        user?.id
      );
      setWishlisted(true);
    }
  };

  const submitReview = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    setIsSubmittingReview(true);

    try {
      await createReview({
        mealId: meal.id,
        rating: reviewForm.rating,
        comment: reviewForm.comment,
        author: "Anonymous",
      });

      const res = await getMealReviews(meal.id);
      setReviews(res.data || []);
      setReviewForm({ rating: 5, comment: "" });
    } finally {
      setIsSubmittingReview(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-10 px-5">
      <button
        onClick={() => router.back()}
        className="mb-6 rounded border px-4 py-2"
      >
        Back
      </button>

      <div className="grid gap-8 lg:grid-cols-[1.4fr_0.8fr]">
        <div className="space-y-6">
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            {meal.image ? (
              <img
                src={meal.image}
                alt={meal.name}
                className="h-96 w-full rounded-lg object-cover"
              />
            ) : (
              <div className="flex h-96 items-center justify-center rounded-lg bg-gray-100 text-gray-500">
                No image available
              </div>
            )}

            <div className="mt-6">
              <h1 className="text-4xl font-bold">
                {meal.name}
              </h1>
              <p className="mt-4 text-gray-600">
                {meal.description}
              </p>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <span className="text-3xl font-bold text-orange-500">
                  ৳ {meal.price}
                </span>
                <div className="flex gap-3">
                  <button
                    onClick={addToCart}
                    className="rounded bg-orange-500 px-6 py-3 text-white"
                  >
                    {added ? "Added" : "Add to Cart"}
                  </button>
                  <button
                    onClick={toggleWishlist}
                    className="rounded border px-6 py-3 text-orange-500"
                  >
                    {wishlisted ? "Remove from Wishlist" : "Save to Wishlist"}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-semibold mb-4">
              Reviews
            </h2>
            <div className="space-y-4">
              <div className="rounded-lg bg-gray-50 p-4">
                <p className="text-sm text-gray-600">
                  Average rating: {averageRating} / 5 ({reviews.length} review{reviews.length === 1 ? "" : "s"})
                </p>
              </div>

              {reviews.length === 0 ? (
                <p className="text-gray-500">No reviews yet. Be the first to leave feedback.</p>
              ) : (
                <div className="space-y-4">
                  {reviews.map((review) => (
                    <div key={review.id} className="rounded-lg border border-gray-200 p-4">
                      <div className="flex items-center justify-between gap-4 text-sm text-gray-600">
                        <span>{review.author}</span>
                        <span>{review.rating} / 5</span>
                      </div>
                      <p className="mt-2 text-gray-700">{review.comment}</p>
                    </div>
                  ))}
                </div>
              )}

              <form onSubmit={submitReview} className="space-y-4 rounded-lg border border-gray-200 p-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Rating</label>
                  <select
                    value={reviewForm.rating}
                    onChange={(e) =>
                      setReviewForm({
                        ...reviewForm,
                        rating: Number(e.target.value),
                      })
                    }
                    className="mt-1 w-full rounded border p-2"
                  >
                    {[5, 4, 3, 2, 1].map((value) => (
                      <option key={value} value={value}>
                        {value}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Comment</label>
                  <textarea
                    value={reviewForm.comment}
                    onChange={(e) =>
                      setReviewForm({
                        ...reviewForm,
                        comment: e.target.value,
                      })
                    }
                    rows={4}
                    className="mt-1 w-full rounded border p-2"
                    placeholder="Share your experience"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmittingReview || reviewForm.comment.trim().length === 0}
                  className="rounded bg-orange-500 px-4 py-2 text-white disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isSubmittingReview ? "Posting review..." : "Submit Review"}
                </button>
              </form>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-semibold mb-4">
            Meal Details
          </h2>
          <div className="space-y-3 text-gray-700">
            <p>
              <strong>Price:</strong> ৳ {meal.price}
            </p>
            <p>
              <strong>Category:</strong> {meal.categoryName || "N/A"}
            </p>
            <p>
              <strong>Rating:</strong> {averageRating}
            </p>
            <p>
              <strong>Reviews:</strong> {reviews.length}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
