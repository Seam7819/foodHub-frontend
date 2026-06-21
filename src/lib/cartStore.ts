import { users } from "@/src/lib/mockData";

export const carts: Record<string, any[]> = {};

export const getUserIdFromAuth = (authHeader?: string) => {
  const token = authHeader?.replace("Bearer ", "");
  if (!token) return null;
  const userId = token.replace(/^mock-token-/, "");
  const exists = users.find((u) => u.id === userId);
  return exists ? userId : null;
};
