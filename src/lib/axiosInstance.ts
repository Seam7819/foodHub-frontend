import axios from "axios";
import { addOrderToStore, replaceOrders } from "@/src/lib/orderStore";

const isLocalhostUrl = (url?: string) => {
  if (!url) return false;
  return /^(https?:\/\/)?(localhost|127\.0\.0\.1)(:\d+)?(\/|$)/i.test(url.trim());
};

const resolveBaseUrl = () => {
  const envUrl = process.env.NEXT_PUBLIC_API_URL?.trim();

  if (envUrl) {
    if (process.env.NODE_ENV === "production" && isLocalhostUrl(envUrl)) {
      if (typeof window !== "undefined") {
        // eslint-disable-next-line no-console
        console.error(
          "NEXT_PUBLIC_API_URL is set to localhost in production. Update your deployed backend URL in your environment variables."
        );
      }
      return undefined;
    }

    // Ensure baseURL always ends with a single trailing slash so axios joins paths correctly.
    return envUrl.replace(/\/$/, "") + "/";
  }

  return "/api/";
};

const axiosInstance = axios.create({
  baseURL: resolveBaseUrl(),

  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to normalize URLs and add auth token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = typeof window !== "undefined" ? window.localStorage.getItem("accessToken") : null;

    // Normalize request URLs so axios joins with baseURL correctly.
    // If baseURL ends with a slash, a leading slash on config.url would override the path.
    if (config.url && typeof config.url === "string" && config.baseURL && config.url.startsWith("/")) {
      config.url = config.url.slice(1);
    }

    if (token) {
      config.headers = config.headers ?? {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle 401 errors
axiosInstance.interceptors.response.use(
  (response) => {
    const orderUrl = response.config?.url ?? "";
    const isOrderRequest = /^(orders|\/orders)(\/|$)/.test(orderUrl);

    if (isOrderRequest && response.status >= 200 && response.status < 300) {
      const payload = response.data?.data;

      if (Array.isArray(payload)) {
        replaceOrders(payload);
      } else if (payload && typeof payload === "object" && "id" in payload) {
        addOrderToStore(payload as any);
      }
    }

    return response;
  },
  (error) => {
    // Log detailed error to console to help diagnose deployment/runtime issues
    try {
      const apiError: Record<string, unknown> = {
        message: error?.message ?? "Unknown API error",
        url: error?.config?.url ?? error?.request?.responseURL,
        method: error?.config?.method,
        status: error?.response?.status,
        data: error?.response?.data,
        isAxiosError: axios.isAxiosError(error),
        code: error?.code,
      };

      if (axios.isAxiosError(error)) {
        apiError.requestUrl = error.config?.url;
        apiError.requestMethod = error.config?.method;
        apiError.responseHeaders = error.response?.headers;
        apiError.rawError = {
          message: error.message,
          name: error.name,
          code: error.code,
          response: {
            status: error.response?.status,
            data: error.response?.data,
          },
        };
      } else if (typeof error === "object" && error !== null) {
        apiError.rawError = error;
      }

      // eslint-disable-next-line no-console
      console.error("API error:", JSON.stringify(apiError, null, 2));
      // eslint-disable-next-line no-console
      console.error("Axios error details:", axios.isAxiosError(error) ? error.toJSON() : error);
    } catch (e) {
      // ignore logging failures
    }

    if (error.response?.status === 401) {
      // Clear auth data on 401
      if (typeof window !== "undefined") {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("role");

        // Redirect to login
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;