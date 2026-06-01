"use client";

import { useState } from "react";
import API from "@/services/api";

export default function SignupPage() {

  const [username, setUsername] = useState("");

  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const handleSignup = async () => {

    try {

      const response = await API.post("/signup", {
        username,
        email,
        password,
      });

      alert("Signup successful");

      console.log(response.data);

    } catch (error) {

      console.error(error);

      alert("Signup failed");
    }
  };

  return (

    <div className="min-h-screen flex flex-col items-center justify-center gap-4">

      <h1 className="text-4xl font-bold">
        Signup
      </h1>

      <input
        type="text"
        placeholder="Username"
        className="border p-2 rounded w-80"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />

      <input
        type="email"
        placeholder="Email"
        className="border p-2 rounded w-80"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        type="password"
        placeholder="Password"
        className="border p-2 rounded w-80"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button
        onClick={handleSignup}
        className="bg-black text-white px-4 py-2 rounded"
      >
        Signup
      </button>

    </div>
  );
}