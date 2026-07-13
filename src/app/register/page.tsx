
"use client";

import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { registerUser } from "@/src/services/auth.service";

type RegisterForm = {
  name: string;
  email: string;
  password: string;
  role: "CUSTOMER" | "PROVIDER";
  businessName: string;
  address: string;
};

type RegisterErrors = Partial<Record<keyof RegisterForm, string>>;

const RegisterPage = () => {
  const router = useRouter();

  const [form, setForm] = useState<RegisterForm>({
    name: "",
    email: "",
    password: "",
    role: "CUSTOMER",
    businessName: "",
    address: "",
  });
  const [errors, setErrors] = useState<RegisterErrors>({});
  const [loading, setLoading] = useState(false);

  const validate = (values: RegisterForm) => {
    const nextErrors: RegisterErrors = {};

    if (!values.name.trim()) {
      nextErrors.name = "Name is required.";
    } else if (values.name.trim().length < 2) {
      nextErrors.name = "Name must be at least 2 characters.";
    }

    if (!values.email.trim()) {
      nextErrors.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
      nextErrors.email = "Enter a valid email address.";
    }

    if (!values.password) {
      nextErrors.password = "Password is required.";
    } else if (values.password.length < 8) {
      nextErrors.password = "Password must be at least 8 characters.";
    }

    if (values.role === "PROVIDER") {
      if (!values.businessName.trim()) {
        nextErrors.businessName = "Business name is required for providers.";
      }
      if (!values.address.trim()) {
        nextErrors.address = "Business address is required for providers.";
      }
    }

    return nextErrors;
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
      await registerUser(form);
      toast.success("Registration successful");
      router.push("/login");
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-md px-5 py-20">
      <div className="rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)] p-8 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.35em] text-orange-600">Create account</p>
        <h1 className="mt-3 text-3xl font-bold text-slate-900 dark:text-white">Register</h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">Join Cartora as a shopper or provider.</p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5" noValidate>
          <div>
            <label htmlFor="register-name" className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">
              Full name
            </label>
            <input
              id="register-name"
              name="name"
              type="text"
              autoComplete="name"
              value={form.name}
              placeholder="Jane Doe"
              aria-invalid={Boolean(errors.name)}
              aria-describedby={errors.name ? "register-name-error" : undefined}
              className="w-full rounded-[var(--radius-md)] border border-[var(--border)] bg-white px-4 py-3 text-sm outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-200 dark:bg-slate-900"
              onChange={(e) => {
                setForm((prev) => ({ ...prev, name: e.target.value }));
                setErrors((prev) => ({ ...prev, name: undefined }));
              }}
            />
            {errors.name && <p id="register-name-error" className="mt-2 text-sm text-red-600">{errors.name}</p>}
          </div>

          <div>
            <label htmlFor="register-email" className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">
              Email address
            </label>
            <input
              id="register-email"
              name="email"
              type="email"
              autoComplete="email"
              value={form.email}
              placeholder="you@example.com"
              aria-invalid={Boolean(errors.email)}
              aria-describedby={errors.email ? "register-email-error" : undefined}
              className="w-full rounded-[var(--radius-md)] border border-[var(--border)] bg-white px-4 py-3 text-sm outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-200 dark:bg-slate-900"
              onChange={(e) => {
                setForm((prev) => ({ ...prev, email: e.target.value }));
                setErrors((prev) => ({ ...prev, email: undefined }));
              }}
            />
            {errors.email && <p id="register-email-error" className="mt-2 text-sm text-red-600">{errors.email}</p>}
          </div>

          <div>
            <label htmlFor="register-password" className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">
              Password
            </label>
            <input
              id="register-password"
              name="password"
              type="password"
              autoComplete="new-password"
              value={form.password}
              placeholder="Minimum 8 characters"
              aria-invalid={Boolean(errors.password)}
              aria-describedby={errors.password ? "register-password-error" : undefined}
              className="w-full rounded-[var(--radius-md)] border border-[var(--border)] bg-white px-4 py-3 text-sm outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-200 dark:bg-slate-900"
              onChange={(e) => {
                setForm((prev) => ({ ...prev, password: e.target.value }));
                setErrors((prev) => ({ ...prev, password: undefined }));
              }}
            />
            {errors.password && <p id="register-password-error" className="mt-2 text-sm text-red-600">{errors.password}</p>}
          </div>

          <div>
            <label htmlFor="register-role" className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">
              Account type
            </label>
            <select
              id="register-role"
              name="role"
              value={form.role}
              className="w-full rounded-[var(--radius-md)] border border-[var(--border)] bg-white px-4 py-3 text-sm outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-200 dark:bg-slate-900"
              onChange={(e) => {
                setForm((prev) => ({ ...prev, role: e.target.value as RegisterForm["role"] }));
                setErrors((prev) => ({ ...prev, businessName: undefined, address: undefined }));
              }}
            >
              <option value="CUSTOMER">Customer</option>
              <option value="PROVIDER">Provider</option>
            </select>
          </div>

          {form.role === "PROVIDER" && (
            <div className="space-y-5 rounded-[var(--radius-md)] border border-orange-100 bg-orange-50/70 p-4 dark:border-orange-500/20 dark:bg-orange-500/10">
              <p className="text-sm text-slate-600 dark:text-slate-300">Please provide your business information.</p>

              <div>
                <label htmlFor="register-business-name" className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">
                  Business name
                </label>
                <input
                  id="register-business-name"
                  name="businessName"
                  type="text"
                  value={form.businessName}
                  placeholder="Your shop or company"
                  aria-invalid={Boolean(errors.businessName)}
                  aria-describedby={errors.businessName ? "register-business-name-error" : undefined}
                  className="w-full rounded-[var(--radius-md)] border border-[var(--border)] bg-white px-4 py-3 text-sm outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-200 dark:bg-slate-900"
                  onChange={(e) => {
                    setForm((prev) => ({ ...prev, businessName: e.target.value }));
                    setErrors((prev) => ({ ...prev, businessName: undefined }));
                  }}
                />
                {errors.businessName && <p id="register-business-name-error" className="mt-2 text-sm text-red-600">{errors.businessName}</p>}
              </div>

              <div>
                <label htmlFor="register-address" className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">
                  Business address
                </label>
                <input
                  id="register-address"
                  name="address"
                  type="text"
                  value={form.address}
                  placeholder="City, country"
                  aria-invalid={Boolean(errors.address)}
                  aria-describedby={errors.address ? "register-address-error" : undefined}
                  className="w-full rounded-[var(--radius-md)] border border-[var(--border)] bg-white px-4 py-3 text-sm outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-200 dark:bg-slate-900"
                  onChange={(e) => {
                    setForm((prev) => ({ ...prev, address: e.target.value }));
                    setErrors((prev) => ({ ...prev, address: undefined }));
                  }}
                />
                {errors.address && <p id="register-address-error" className="mt-2 text-sm text-red-600">{errors.address}</p>}
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-[var(--radius-md)] bg-orange-600 px-4 py-3 font-semibold text-white transition hover:bg-orange-700 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading ? "Creating account..." : "Register"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;

