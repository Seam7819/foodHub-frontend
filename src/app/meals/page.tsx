"use client";

import { useEffect, useState } from "react";

import MealCard from "@/src/components/meals/MealCard";

import { getMeals } from "@/src/services/meal.service";

const MealsPage = () => {
  const [meals, setMeals] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    const loadMeals =
      async () => {
        try {
          const res =
            await getMeals();

          setMeals(
            res.data
          );
        } catch (err) {
          console.log(err);
        } finally {
          setLoading(false);
        }
      };

    loadMeals();
  }, []);

  if (loading) {
    return (
      <div className="text-center py-20">
        Loading meals...
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-5 py-10">
      <h1 className="text-4xl font-bold mb-8">
        All Meals
      </h1>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {meals.map(
          (meal: any) => (
            <MealCard
              key={meal.id}
              meal={meal}
            />
          )
        )}
      </div>
    </div>
  );
};

export default MealsPage;