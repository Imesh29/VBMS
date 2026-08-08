import type { ReactNode, ChangeEvent } from "react";

interface InputFieldProps {
  icon: ReactNode;
  rightIcon?: ReactNode;

  type: string;

  placeholder: string;

  value: string;

  onChange: (event: ChangeEvent<HTMLInputElement>) => void;

  name?: string;

  disabled?: boolean;
}

export default function InputField({
  icon,
  rightIcon,
  type,
  placeholder,
  value,
  onChange,
  name,
  disabled = false,
}: InputFieldProps) {
  return (
    <div className="flex items-center rounded-xl border border-gray-200 bg-gray-50 px-4 py-4 transition focus-within:border-[#5B1E1D] focus-within:ring-4 focus-within:ring-[#5B1E1D]/10">
      <span className="mr-3 text-gray-400">{icon}</span>

      <input
        name={name}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className="flex-1 bg-transparent text-gray-700 outline-none placeholder:text-gray-400 disabled:cursor-not-allowed disabled:opacity-60"
      />

      {rightIcon && <span className="text-gray-400">{rightIcon}</span>}
    </div>
  );
}
