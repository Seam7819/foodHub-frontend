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

class StripeCheckoutError extends Error {
  status?: number;
  details?: unknown;

  constructor(message: string, status?: number, details?: unknown) {
    super(message);
    this.name = "StripeCheckoutError";
    this.status = status;
    this.details = details;
  }
}

const parseStripeErrorBody = async (response: Response) => {
  const contentType = response.headers.get("content-type") || "";

  if (contentType.includes("application/json")) {
    try {
      return await response.json();
    } catch {
      return await response.text();
    }
  }

  return await response.text();
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
    const errorBody = await parseStripeErrorBody(response);
    const message = `Stripe checkout failed: ${response.status} ${
      typeof errorBody === "string" ? errorBody : JSON.stringify(errorBody)
    }`;

    throw new StripeCheckoutError(message, response.status, errorBody);
  }

  return response.json() as Promise<{ url: string }>;
};
