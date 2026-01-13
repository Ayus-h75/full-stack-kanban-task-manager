import React, { useState } from "react";
import API from "../api/api";
import { getToken } from "../utils/auth";

export default function Profile() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const updateProfile = async () => {
    await API.put(
      "/auth/update",
      { name, email },
      { headers: { Authorization: `Bearer ${getToken()}` } }
    );
  };

  return (
    <div className="p-6 max-w-md mx-auto mt-20">
      <h1 className="text-2xl font-bold mb-4">Edit Profile</h1>

      <input
        className="border p-2 w-full mb-2"
        placeholder="New Name"
        onChange={(e) => setName(e.target.value)}
      />

      <input
        className="border p-2 w-full mb-2"
        placeholder="New Email"
        onChange={(e) => setEmail(e.target.value)}
      />

      <button className="bg-purple-600 text-white p-2 w-full" onClick={updateProfile}>
        Save
      </button>
    </div>
  );
}
