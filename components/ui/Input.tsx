'use client';

import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    id: string;
    label: string;
}

const Input: React.FC<InputProps> = ({ id, label, ...props }) => {
  return (
    <div className="relative">
      <input
        id={id}
        {...props}
        placeholder=" " // Important for label animation
        className="block w-full px-4 py-3 border rounded-md peer focus:outline-none focus:ring-0 appearance-none"
      />
      <label
        htmlFor={id}
        className="absolute text-md text-zinc-400 duration-150 transform -translate-y-4 scale-75 top-4 z-10 origin-[0] left-4 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4"
      >
        {label}
      </label>
    </div>
  );
};

export default Input;