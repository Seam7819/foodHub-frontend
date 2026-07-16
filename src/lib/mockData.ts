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
  availableItems?: number;
  isAvailable?: boolean;
};

export const users: User[] = [
  {
    id: "user-1",
    name: "CartOra Customer",
    email: "user@example.com",
    password: "user1234",
    role: "CUSTOMER",
    status: "ACTIVE",
  },
  {
    id: "provider-1",
    name: "CartOra Provider",
    email: "provider@example.com",
    password: "provider1234",
    role: "PROVIDER",
    businessName: "Provider One",
    address: "123 Provider Way",
    status: "ACTIVE",
  },
  {
    id: "admin-1",
    name: "CartOra Admin",
    email: "admin@example.com",
    password: "admin1234",
    role: "ADMIN",
    status: "ACTIVE",
  },
];

export const categories: Category[] = [
  { id: "cat-1", name: "Cloths" },
  { id: "cat-2", name: "Women" },
  { id: "cat-3", name: "Men" },
  { id: "cat-4", name: "Accessories" },
];

export const providers: Provider[] = [
  {
    id: "provider-1",
    name: "Dan Rivera",
    businessName: "Urban Threads",
    description: "Urban Threads is a premium fashion retailer offering modern men's and women's clothing, footwear, and accessories. We focus on quality craftsmanship, timeless designs, and affordable luxury.",
    image:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=500&h=500&fit=crop",
  },
  {
    id: "provider-2",
    name: "Nina Brooks",
    businessName: "Elite Fashion House",
    description: "Elite Fashion House brings together stylish apparel, luxury jewelry, handbags, watches, and fashion accessories from top designers to help customers express their unique style.",
    image:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=500&h=500&fit=crop",
  },
];

export const meals: Meal[] = [
  {
    "id": "product-1",
    "name": "Men's Premium Slim Fit Shirt",
    "description": "Premium cotton slim-fit shirt with breathable fabric for everyday and formal wear.",
    "price": 1499,
    "image": "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf",
    "categoryId": "cat-men",
    "categoryName": "Men's Clothing",
    "providerId": "brand-1",
    "provider": {
      "id": "brand-1",
      "name": "Urban Wear",
      "businessName": "Urban Wear Fashion"
    },
    "availableItems": 35,
    "isAvailable": true
  },
  {
    "id": "product-2",
    "name": "Men's Casual Denim Jacket",
    "description": "Classic blue denim jacket with a modern fit and premium stitching.",
    "price": 2799,
    "image": "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f",
    "categoryId": "cat-men",
    "categoryName": "Men's Clothing",
    "providerId": "brand-1",
    "provider": {
      "id": "brand-1",
      "name": "Urban Wear",
      "businessName": "Urban Wear Fashion"
    },
    "availableItems": 18,
    "isAvailable": true
  },
  {
    "id": "product-3",
    "name": "Women's Floral Maxi Dress",
    "description": "Elegant floral maxi dress crafted with lightweight breathable fabric.",
    "price": 2299,
    "image": "https://images.unsplash.com/photo-1496747611176-843222e1e57c",
    "categoryId": "cat-women",
    "categoryName": "Women's Clothing",
    "providerId": "brand-2",
    "provider": {
      "id": "brand-2",
      "name": "Luna Fashion",
      "businessName": "Luna Fashion House"
    },
    "availableItems": 22,
    "isAvailable": true
  },
  {
    "id": "product-4",
    "name": "Women's Oversized Hoodie",
    "description": "Soft fleece oversized hoodie designed for comfort and street style.",
    "price": 1999,
    "image": "https://images.unsplash.com/photo-1529139574466-a303027c1d8b",
    "categoryId": "cat-women",
    "categoryName": "Women's Clothing",
    "providerId": "brand-2",
    "provider": {
      "id": "brand-2",
      "name": "Luna Fashion",
      "businessName": "Luna Fashion House"
    },
    "availableItems": 40,
    "isAvailable": true
  },
  {
    "id": "product-5",
    "name": "Luxury Gold-Plated Necklace Set",
    "description": "Premium gold-plated necklace with matching earrings for special occasions.",
    "price": 3499,
    "image": "https://images.unsplash.com/photo-1617038220319-276d3cfab638",
    "categoryId": "cat-jewellery",
    "categoryName": "Jewellery",
    "providerId": "brand-3",
    "provider": {
      "id": "brand-3",
      "name": "Golden Spark",
      "businessName": "Golden Spark Jewellery"
    },
    "availableItems": 12,
    "isAvailable": true
  },
  {
    "id": "product-6",
    "name": "Silver Diamond Ring",
    "description": "Elegant sterling silver ring featuring a sparkling cubic zirconia stone.",
    "price": 2599,
    "image": "https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0",
    "categoryId": "cat-jewellery",
    "categoryName": "Jewellery",
    "providerId": "brand-3",
    "provider": {
      "id": "brand-3",
      "name": "Golden Spark",
      "businessName": "Golden Spark Jewellery"
    },
    "availableItems": 15,
    "isAvailable": true
  },
  {
    "id": "product-7",
    "name": "Classic Leather Wallet",
    "description": "Premium genuine leather wallet with multiple card slots and cash compartments.",
    "price": 999,
    "image": "https://images.unsplash.com/photo-1627123424574-724758594e93",
    "categoryId": "cat-accessories",
    "categoryName": "Accessories",
    "providerId": "brand-4",
    "provider": {
      "id": "brand-4",
      "name": "Elite Leather",
      "businessName": "Elite Leather Goods"
    },
    "availableItems": 50,
    "isAvailable": true
  },
  {
    "id": "product-8",
    "name": "Women's Crossbody Handbag",
    "description": "Minimalist PU leather crossbody handbag with adjustable strap.",
    "price": 1899,
    "image": "https://images.unsplash.com/photo-1584917865442-de89df76afd3",
    "categoryId": "cat-accessories",
    "categoryName": "Accessories",
    "providerId": "brand-4",
    "provider": {
      "id": "brand-4",
      "name": "Elite Leather",
      "businessName": "Elite Leather Goods"
    },
    "availableItems": 30,
    "isAvailable": true
  },
  {
    "id": "product-9",
    "name": "Luxury Analog Watch",
    "description": "Water-resistant stainless steel analog watch with premium leather strap.",
    "price": 4999,
    "image": "https://images.unsplash.com/photo-1523170335258-f5ed11844a49",
    "categoryId": "cat-accessories",
    "categoryName": "Accessories",
    "providerId": "brand-5",
    "provider": {
      "id": "brand-5",
      "name": "TimeX",
      "businessName": "TimeX Watches"
    },
    "availableItems": 16,
    "isAvailable": true
  },
  {
    "id": "product-10",
    "name": "Men's Running Sneakers",
    "description": "Lightweight breathable running shoes with cushioned sole for all-day comfort.",
    "price": 3299,
    "image": "https://images.unsplash.com/photo-1542291026-7eec264c27ff",
    "categoryId": "cat-men",
    "categoryName": "Men's Clothing",
    "providerId": "brand-6",
    "provider": {
      "id": "brand-6",
      "name": "Stride",
      "businessName": "Stride Sports"
    },
    "availableItems": 28,
    "isAvailable": true
  }
];

