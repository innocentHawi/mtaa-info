"use client";
import { useState } from "react";

export default function AdminLogin() {
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    document.cookie = `admin_auth=${password}; path=/;`;
    window.location.href = "/admin/faqs"; // redirect after login
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Admin Login</h1>
      <input
        type="password"
        className="border p-2 mr-2"
        placeholder="Enter password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button
        onClick={handleLogin}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Login
      </button>
    </div>
  );
}
