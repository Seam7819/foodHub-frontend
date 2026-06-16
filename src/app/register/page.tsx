"use client";

import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { registerUser } from "@/src/services/auth.service";

const RegisterPage =
  () => {
    const router =
      useRouter();

    const [form, setForm] =
      useState({
        name: "",
        email: "",
        password: "",
        role:
          "CUSTOMER",
      });

    const handleSubmit =
      async (
        e: React.FormEvent
      ) => {
        e.preventDefault();

        try {
          await registerUser(
            form
          );

          toast.success(
            "Registration successful"
          );

          router.push(
            "/login"
          );
        } catch {
          toast.error(
            "Registration failed"
          );
        }
      };

    return (
      <div className="max-w-md mx-auto py-20 px-5">
        <h1 className="text-3xl font-bold mb-8">
          Register
        </h1>

        <form
          onSubmit={
            handleSubmit
          }
          className="space-y-4"
        >
          <input
            placeholder="Name"
            className="w-full border p-3 rounded"
            onChange={(e) =>
              setForm({
                ...form,
                name: e.target.value,
              })
            }
          />

          <input
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

          <select
            className="w-full border p-3 rounded"
            onChange={(e) =>
              setForm({
                ...form,
                role:
                  e.target
                    .value as
                    any,
              })
            }
          >
            <option value="CUSTOMER">
              Customer
            </option>

            <option value="PROVIDER">
              Provider
            </option>
          </select>

          <button className="w-full bg-orange-500 text-white py-3 rounded">
            Register
          </button>
        </form>
      </div>
    );
  };

export default RegisterPage;