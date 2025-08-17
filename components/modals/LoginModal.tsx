"use client";

import { useState } from "react";
import { signIn } from 'next-auth/react';
import Button from "../ui/Button";
import Input from "../ui/Input";
import { useRouter } from "next/navigation";

const LoginModal = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(""); // Clear previous errors

    try {
      const result = await signIn('credentials', {
        redirect: false, // We will handle redirect manually
        email,
        password,
      });

      if (result?.error) {
        setError("Invalid email or password. Please try again.");
        setIsLoading(false);
      } else {
        // Successful login
        alert('Login successful!');
        router.refresh(); // Refresh the page to update session state
        // Here you would typically close the modal
      }

    } catch (err) {
      setError("Something went wrong. Please try again later.");
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Login to your Account</h2>
        <form onSubmit={onSubmit} className="flex flex-col gap-4">
          <Input id="email" label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} disabled={isLoading} />
          <Input id="password" label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} disabled={isLoading} />
          
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
          
          <div className="mt-4">
            <Button label="Login" type="submit" disabled={isLoading} />
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginModal;