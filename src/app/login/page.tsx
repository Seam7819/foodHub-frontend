"use client";

import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { loginUser } from "@/src/services/auth.service";
import { useAuth } from "@/src/context/AuthContext";

const LoginPage = () => {
  const router = useRouter();
  const { setUser } = useAuth();



  const [form, setForm] =
    useState({
      email: "",
      password: "",
    });

  const handleSubmit =
    async (
      e: React.FormEvent
    ) => {
      e.preventDefault();

      try {
        const res =
          await loginUser(form);

        localStorage.setItem(
          "accessToken",
          res.accessToken
        );

        localStorage.setItem(
          "refreshToken",
          res.refreshToken
        );

        localStorage.setItem(
          "role",
          res.user.role
        );

        toast.success(
          "Login successful"
        );

        setUser(res.user);

        if (res.user.role === "ADMIN") {
          router.push("/admin");
        } else if (
          res.user.role === "PROVIDER"
        ) {
          router.push(
            "/provider/dashboard"
          );
        } else {
          router.push("/profile");
        }
      } catch (error: any) {
        console.log(
          "FULL ERROR:",
          JSON.stringify(
            error?.response?.data,
            null,
            2
          )
        );

        const htmlResponse =
          typeof error?.response?.data === "string" &&
          error.response.data.trim().startsWith("<!DOCTYPE html>");

        toast.error(
          htmlResponse
            ? "Login API route not found. Verify NEXT_PUBLIC_API_URL and that your backend is running."
            : error?.response?.data?.message ||
              "Login failed"
        );
      }
    };

  return (
    <div className="max-w-md mx-auto py-20 px-5">
      <h1 className="text-3xl font-bold mb-8">
        Login
      </h1>

      <form
        onSubmit={
          handleSubmit
        }
        className="space-y-4"
      >
        <input
          type="email"
          placeholder="Email"
          className="w-full border p-3 rounded"
          onChange={(e) =>
            setForm({
              ...form,
              email:
                e.target.value,
            })
          }
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full border p-3 rounded"
          onChange={(e) =>
            setForm({
              ...form,
              password:
                e.target.value,
            })
          }
        />

        <button
          className="w-full bg-orange-500 text-white py-3 rounded"
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default LoginPage;