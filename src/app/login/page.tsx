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


        toast.success(
          "Login successful"
        );

        setUser(res.user);

        router.push("/");
      } catch (error: any) {
        console.log(
          "FULL ERROR:",
          JSON.stringify(
            error?.response?.data,
            null,
            2
          )
        );

        toast.error(
          error?.response?.data?.message ||
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