export type User = {
  id: string;
  name: string;
  email: string;
  password: string;
  role: "CUSTOMER" | "PROVIDER" | "ADMIN";
  businessName?: string;
  address?: string;
  status?: string;
};

export type Category = {
  id: string;
  name: string;
};

export type Provider = {
  id: string;
  name: string;
  businessName: string;
  description: string;
  image?: string;
};

export type Meal = {
  id: string;
  name: string;
  description: string;
  price: number;
  image?: string;
  categoryId: string;
  categoryName: string;
  providerId: string;
  provider: {
    id: string;
    name: string;
    businessName: string;
  };
};

export const users: User[] = [
  {
    id: "user-1",
    name: "Anna Johnson",
    email: "anna@foodhub.com",
    password: "password123",
    role: "CUSTOMER",
  },
  {
    id: "provider-1",
    name: "Dan Rivera",
    email: "dan@foodhub.com",
    password: "provider123",
    role: "PROVIDER",
    businessName: "FoodHub Consulting",
    address: "123 Business Ave",
  },
  {
    id: "admin-1",
    name: "Nina Brooks",
    email: "admin@foodhub.com",
    password: "admin123",
    role: "ADMIN",
  },
];

export const categories: Category[] = [
  { id: "cat-1", name: "Consulting" },
  { id: "cat-2", name: "Team Training" },
  { id: "cat-3", name: "Security" },
  { id: "cat-4", name: "Strategy" },
];

export const providers: Provider[] = [
  {
    id: "provider-1",
    name: "Dan Rivera",
    businessName: "FoodHub Consulting",
    description: "Executive and team consulting for modern organizations.",
    image:
      "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&q=80",
  },
  {
    id: "provider-2",
    name: "Nina Brooks",
    businessName: "Nest Strategy Group",
    description: "Business strategy and process optimization services.",
    image:
      "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&q=80",
  },
];

export const meals: Meal[] = [
  {
    id: "meal-1",
    name: "Leadership Workshop",
    description: "A guided workshop to improve leadership skills and team alignment.",
    price: 299,
    image:
      "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&q=80",
    categoryId: "cat-2",
    categoryName: "Team Training",
    providerId: "provider-1",
    provider: {
      id: "provider-1",
      name: "Dan Rivera",
      businessName: "FoodHub Consulting",
    },
  },
  {
    id: "meal-2",
    name: "Security Review",
    description: "An audit and remediation plan for your organization’s security workflows.",
    price: 499,
    image:
      "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&q=80",
    categoryId: "cat-3",
    categoryName: "Security",
    providerId: "provider-2",
    provider: {
      id: "provider-2",
      name: "Nina Brooks",
      businessName: "Nest Strategy Group",
    },
  },
  {
    id: "meal-3",
    name: "Strategy Session",
    description: "A planning session to define your next quarter of growth and operations.",
    price: 399,
    image:
      "https://images.unsplash.com/photo-1497694201723-9562967107ac?w=800&q=80",
    categoryId: "cat-4",
    categoryName: "Strategy",
    providerId: "provider-1",
    provider: {
      id: "provider-1",
      name: "Dan Rivera",
      businessName: "FoodHub Consulting",
    },
  },
];
