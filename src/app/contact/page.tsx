"use client";

import { useState } from "react";
import { toast } from "sonner";

type ContactForm = {
  name: string;
  email: string;
  message: string;
};

type ContactErrors = Partial<Record<keyof ContactForm, string>>;

const ContactPage = () => {
  const [form, setForm] = useState<ContactForm>({ name: "", email: "", message: "" });
  const [errors, setErrors] = useState<ContactErrors>({});
  const [loading, setLoading] = useState(false);

  const validate = (values: ContactForm) => {
    const nextErrors: ContactErrors = {};

    if (!values.name.trim()) {
      nextErrors.name = "Name is required.";
    }

    if (!values.email.trim()) {
      nextErrors.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
      nextErrors.email = "Enter a valid email address.";
    }

    if (!values.message.trim()) {
      nextErrors.message = "Message is required.";
    } else if (values.message.trim().length < 10) {
      nextErrors.message = "Please share a bit more detail.";
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
      await new Promise((resolve) => setTimeout(resolve, 600));
      toast.success("Thanks! Your message has been received.");
      setForm({ name: "", email: "", message: "" });
      setErrors({});
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-5 py-16">
      <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-orange-600">Contact</p>
          <h1 className="mt-3 text-3xl font-bold text-slate-900 dark:text-white">Let’s talk about your next launch.</h1>
          <p className="mt-4 text-slate-600 dark:text-slate-300">
            Reach out for partnerships, vendor onboarding, or product support. Our team will get back to you shortly.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-700 dark:bg-slate-900" noValidate>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label htmlFor="contact-name" className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">
                Name
              </label>
              <input
                id="contact-name"
                name="name"
                type="text"
                autoComplete="name"
                value={form.name}
                aria-invalid={Boolean(errors.name)}
                aria-describedby={errors.name ? "contact-name-error" : undefined}
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-200 dark:border-slate-700 dark:bg-slate-900"
                onChange={(e) => {
                  setForm((prev) => ({ ...prev, name: e.target.value }));
                  setErrors((prev) => ({ ...prev, name: undefined }));
                }}
              />
              {errors.name && <p id="contact-name-error" className="mt-2 text-sm text-red-600">{errors.name}</p>}
            </div>

            <div>
              <label htmlFor="contact-email" className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">
                Email
              </label>
              <input
                id="contact-email"
                name="email"
                type="email"
                autoComplete="email"
                value={form.email}
                aria-invalid={Boolean(errors.email)}
                aria-describedby={errors.email ? "contact-email-error" : undefined}
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-200 dark:border-slate-700 dark:bg-slate-900"
                onChange={(e) => {
                  setForm((prev) => ({ ...prev, email: e.target.value }));
                  setErrors((prev) => ({ ...prev, email: undefined }));
                }}
              />
              {errors.email && <p id="contact-email-error" className="mt-2 text-sm text-red-600">{errors.email}</p>}
            </div>
          </div>

          <div className="mt-4">
            <label htmlFor="contact-message" className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">
              Message
            </label>
            <textarea
              id="contact-message"
              name="message"
              rows={5}
              value={form.message}
              aria-invalid={Boolean(errors.message)}
              aria-describedby={errors.message ? "contact-message-error" : undefined}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-200 dark:border-slate-700 dark:bg-slate-900"
              onChange={(e) => {
                setForm((prev) => ({ ...prev, message: e.target.value }));
                setErrors((prev) => ({ ...prev, message: undefined }));
              }}
            />
            {errors.message && <p id="contact-message-error" className="mt-2 text-sm text-red-600">{errors.message}</p>}
          </div>

          <button type="submit" disabled={loading} className="mt-6 rounded-full bg-orange-600 px-6 py-3 font-semibold text-white transition hover:bg-orange-700 disabled:cursor-not-allowed disabled:opacity-70">
            {loading ? "Sending..." : "Send message"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ContactPage;
