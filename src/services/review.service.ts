export type Review = {
  id: string;
  mealId: string;
  rating: number;
  comment: string;
  author: string;
  createdAt: string;
};

const REVIEW_KEY = "foodhub_reviews";

const getReviewsFromStorage = (): Review[] => {
  if (typeof window === "undefined") return [];
  return JSON.parse(localStorage.getItem(REVIEW_KEY) || "[]");
};

const setReviewsToStorage = (reviews: Review[]) => {
  if (typeof window === "undefined") return;
  localStorage.setItem(REVIEW_KEY, JSON.stringify(reviews));
};

export const createReview = async (payload: {
  mealId: string;
  rating: number;
  comment: string;
  author: string;
}) => {
  const reviews = getReviewsFromStorage();
  reviews.push({
    ...payload,
    id: `${payload.mealId}-${Date.now()}`,
    createdAt: new Date().toISOString(),
  });
  setReviewsToStorage(reviews);
  return { data: payload };
};

export const getMealReviews = async (mealId: string) => {
  const reviews = getReviewsFromStorage();
  return {
    data: reviews.filter((review) => review.mealId === mealId),
  };
};
