import type { ReactNode } from "react";

interface InputFieldProps {
  icon: ReactNode;
  rightIcon?: ReactNode;
  type: string;
  placeholder: string;
}

export default function InputField({
  icon,
  rightIcon,
  type,
  placeholder,
}: InputFieldProps) {
  return (
   <div className="flex items-center rounded-xl border border-gray-200 bg-gray-50 px-4 py-4 focus-within:border-[#5B1E1D] focus-within:ring-4 focus-within:ring-[#5B1E1D]/10 transition">

      <span className="text-gray-400 mr-3">
        {icon}
      </span>

      <input
        type={type}
        placeholder={placeholder}
        className="flex-1 bg-transparent outline-none text-gray-700 placeholder:text-gray-400"
      />

      {rightIcon && (
        <span className="text-gray-400 cursor-pointer">
          {rightIcon}
        </span>
      )}
    </div>
  );
}