import { redirect } from "next/navigation";

export default function MealsPage() {
  // Keep backward compatibility: redirect legacy /meals to /products
  redirect("/products");
}
