"use client";

import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { loginUser } from "@/src/services/auth.service";
import { useAuth } from "@/src/context/AuthContext";

type LoginForm = {
  email: string;
  password: string;
};

type LoginErrors = Partial<Record<keyof LoginForm, string>>;

type CredentialPreset = {
  label: string;
  email: string;
  password: string;
};

const presets: CredentialPreset[] = [
  { label: "Admin", email: "admin@foodhub.com", password: "admin123" },
  { label: "Provider", email: "dan@foodhub.com", password: "provider123" },
  { label: "Customer", email: "anna@foodhub.com", password: "password123" },
];

const LoginPage = () => {
  const router = useRouter();
  const { setUser } = useAuth();

  const [form, setForm] = useState<LoginForm>({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<LoginErrors>({});
  const [loading, setLoading] = useState(false);

  const validate = (values: LoginForm) => {
    const nextErrors: LoginErrors = {};

    if (!values.email.trim()) {
      nextErrors.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
      nextErrors.email = "Enter a valid email address.";
    }

    if (!values.password) {
      nextErrors.password = "Password is required.";
    } else if (values.password.length < 6) {
      nextErrors.password = "Password must be at least 6 characters.";
    }

    return nextErrors;
  };

  const applyPreset = (preset: CredentialPreset) => {
    setForm({ email: preset.email, password: preset.password });
    setErrors({});
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const nextErrors = validate(form);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    setLoading(true);

    try {
      const res = await loginUser(form);

      localStorage.setItem("accessToken", res.accessToken);
      localStorage.setItem("refreshToken", res.refreshToken);
      localStorage.setItem("role", res.user.role);

      toast.success("Login successful");
      setUser(res.user);

      if (res.user.role === "ADMIN") {
        router.push("/admin");
      } else if (res.user.role === "PROVIDER") {
        router.push("/provider/dashboard");
      } else {
        router.push("/profile");
      }
    } catch (error: any) {
      const htmlResponse =
        typeof error?.response?.data === "string" &&
        error.response.data.trim().startsWith("<!DOCTYPE html>");
      const apiMessage =
        error?.response?.data?.message ||
        error?.response?.data ||
        error?.message ||
        "Login failed";

      toast.error(
        htmlResponse
          ? "Login API route not found. Verify NEXT_PUBLIC_API_URL and that your backend is running."
          : apiMessage
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-md px-5 py-20">
      <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-700 dark:bg-slate-900">
        <p className="text-sm font-semibold uppercase tracking-[0.35em] text-orange-600">Welcome back</p>
        <h1 className="mt-3 text-3xl font-bold text-slate-900 dark:text-white">Login</h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">Access your account and continue shopping.</p>

        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          {presets.map((preset) => (
            <button
              key={preset.label}
              type="button"
              onClick={() => applyPreset(preset)}
              className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-800 transition hover:border-orange-400 hover:bg-orange-50 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:hover:bg-orange-500/10"
            >
              {preset.label}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5" noValidate>
          <div>
            <label htmlFor="login-email" className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">
              Email address
            </label>
            <input
              id="login-email"
              name="email"
              type="email"
              autoComplete="email"
              value={form.email}
              placeholder="you@example.com"
              aria-invalid={Boolean(errors.email)}
              aria-describedby={errors.email ? "login-email-error" : undefined}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-200 dark:border-slate-700 dark:bg-slate-900"
              onChange={(e) => {
                setForm((prev) => ({ ...prev, email: e.target.value }));
                setErrors((prev) => ({ ...prev, email: undefined }));
              }}
            />
            {errors.email && <p id="login-email-error" className="mt-2 text-sm text-red-600">{errors.email}</p>}
          </div>

          <div>
            <label htmlFor="login-password" className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">
              Password
            </label>
            <input
              id="login-password"
              name="password"
              type="password"
              autoComplete="current-password"
              value={form.password}
              placeholder="••••••••"
              aria-invalid={Boolean(errors.password)}
              aria-describedby={errors.password ? "login-password-error" : undefined}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-200 dark:border-slate-700 dark:bg-slate-900"
              onChange={(e) => {
                setForm((prev) => ({ ...prev, password: e.target.value }));
                setErrors((prev) => ({ ...prev, password: undefined }));
              }}
            />
            {errors.password && <p id="login-password-error" className="mt-2 text-sm text-red-600">{errors.password}</p>}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-orange-600 px-4 py-3 font-semibold text-white transition hover:bg-orange-700 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading ? "Signing in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
