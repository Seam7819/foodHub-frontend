import axios from "axios";

const isLocalhostUrl = (url?: string) => {
  if (!url) return false;
  return /^(https?:\/\/)?(localhost|127\.0\.0\.1)(:\d+)?(\/|$)/i.test(url.trim());
};

const resolveBaseUrl = () => {
  const envUrl = process.env.NEXT_PUBLIC_API_URL?.trim();

  if (envUrl) {
    if (process.env.NODE_ENV === "production" && isLocalhostUrl(envUrl)) {
      // Avoid using localhost in production builds.
      // Vercel should use the deployed backend URL instead.
      if (typeof window !== "undefined") {
        // eslint-disable-next-line no-console
        console.error(
          "NEXT_PUBLIC_API_URL is set to localhost in production. Update your Vercel environment variable to your deployed backend URL."
        );
      }
      return undefined;
    }
    return envUrl;
  }

  if (typeof window !== "undefined") {
    return `${window.location.origin}/api`;
  }

  return undefined;
};

const axiosInstance = axios.create({
  baseURL: resolveBaseUrl(),

  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add auth token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
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
  (response) => response,
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
      console.error("API error:", apiError, error);
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