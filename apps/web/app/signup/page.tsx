"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Signup() {
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("http://localhost:5000/api/v1/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (res.ok) router.push("/signin");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-bold mb-4">Sign Up</h2>
        <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
          <input
            type="text"
            name="username"
            placeholder="Username"
            className="border p-2 rounded"
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            className="border p-2 rounded"
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            className="border p-2 rounded"
            onChange={handleChange}
            required
          />
          <button className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
            Sign Up
          </button>
        </form>
        <p className="text-sm mt-4 text-center">
          Already have an account?{" "}
          <a href="/signin" className="text-blue-500">
            Sign in
          </a>
        </p>
      </div>
    </div>
  );
}
