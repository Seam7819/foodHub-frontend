import { useQuery } from "@tanstack/react-query";
import { getMeals } from "../services/meal.service";


export const useMeals =
  () => {
    return useQuery({
      queryKey: ["meals"],

      queryFn: getMeals,
    });
  };