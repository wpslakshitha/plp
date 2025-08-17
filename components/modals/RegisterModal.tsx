"use client";

import axios from "axios";
import { useState } from "react";
import Button from "../ui/Button";
import Input from "../ui/Input";

const RegisterModal = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await axios.post('/api/register', {
        email,
        name,
        password
      });
      // Handle successful registration (e.g., show login modal, show a success message)
      alert('Registration successful! Please login.');
      // Here you would typically close this modal and open the login modal
    } catch (error) {
      console.error(error);
      alert('Something went wrong.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    // This is a simplified modal structure. We will build a proper reusable modal component later.
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Register as a Seller</h2>
        <form onSubmit={onSubmit} className="flex flex-col gap-4">
          <Input id="name" label="Name" value={name} onChange={(e) => setName(e.target.value)} disabled={isLoading} />
          <Input id="email" label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} disabled={isLoading} />
          <Input id="password" label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} disabled={isLoading} />
          <div className="mt-4">
            <Button label="Register" type="submit" disabled={isLoading} />
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterModal;