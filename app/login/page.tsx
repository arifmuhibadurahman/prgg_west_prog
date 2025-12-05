"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();

    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    if (res.ok) {
      router.push("/admin");
    } else {
      const data = await res.json();
      setError(data.message || "Login gagal");
    }
  }

  return (
    <div style={{
      maxWidth: "350px",
      margin: "80px auto",
      padding: "20px",
      border: "1px solid #ddd",
      borderRadius: "8px"
    }}>
      <h2 style={{ textAlign: "center", marginBottom: "20px" }}>Login Admin</h2>

      <form onSubmit={handleLogin}>
        <div style={{ marginBottom: "10px" }}>
          <label>Username</label>
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            style={{
              width: "100%",
              padding: "8px",
              marginTop: "5px",
              borderRadius: "5px",
              border: "1px solid #ccc"
            }}
          />
        </div>

        <div style={{ marginBottom: "10px" }}>
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{
              width: "100%",
              padding: "8px",
              marginTop: "5px",
              borderRadius: "5px",
              border: "1px solid #ccc"
            }}
          />
        </div>

        {error && <p style={{ color: "red", marginBottom: "10px" }}>{error}</p>}

        <button
          type="submit"
          style={{
            width: "100%",
            padding: "10px",
            background: "#333",
            color: "white",
            border: "none",
            borderRadius: "5px",
            marginTop: "10px",
            cursor: "pointer"
          }}
        >
          Login
        </button>
      </form>
    </div>
  );
}
