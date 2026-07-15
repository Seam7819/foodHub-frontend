export function generateMealId(existingMeals: Array<{ id?: string }>) {
  let nextNumber = 1;

  while (existingMeals.some((meal) => meal.id === `meal-${nextNumber}`)) {
    nextNumber += 1;
  }

  return `meal-${nextNumber}`;
}
