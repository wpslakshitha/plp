'use client';
import { IconType } from "react-icons";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
  outline?: boolean;
  icon?: IconType;
}

const Button: React.FC<ButtonProps> = ({ label, outline, icon: Icon, ...props }) => {
  return (
    <button {...props} className={`
      relative disabled:opacity-70 disabled:cursor-not-allowed rounded-lg
      hover:opacity-80 transition w-full flex items-center justify-center
      ${outline ? 'bg-white border-black text-black' : 'bg-rose-500 border-rose-500 text-white'}
      ${outline ? 'py-3 font-semibold border-[1px]' : 'py-3 font-bold'}
    `}>
      {Icon && <Icon size={24} className="absolute left-4 top-3" />}
      {label}
    </button>
  );
};
export default Button;