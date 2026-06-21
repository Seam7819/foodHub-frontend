export type CheckoutItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
};

export type CreateCheckoutSessionPayload = {
  deliveryAddress: string;
  items: CheckoutItem[];
};

export const createCheckoutSession = async (payload: CreateCheckoutSessionPayload) => {
  const response = await fetch("/api/stripe/checkout", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Stripe checkout failed: ${response.status} ${errorText}`);
  }

  return response.json();
};
