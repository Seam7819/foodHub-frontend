export interface IMeal {
  id: string;

  name: string;

  description: string;

  image?: string;

  price: number;
  averageRating: number;
  reviewCount: number;
  categoryName?: string;
  provider?: {
    id: string;
    userId?: string;
    businessName?: string;
    name?: string;
  };
}