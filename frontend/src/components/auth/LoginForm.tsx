import { useState } from "react";

import { FaEnvelope, FaLock, FaEye } from "react-icons/fa";

import RoleDropdown, { type LoginRole } from "./RoleDropdown";

import InputField from "../common/InputField";

import { useAuth } from "../../context/AuthContext";

export default function LoginForm() {
  const { login } = useAuth();

  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const [selectedRole, setSelectedRole] = useState<LoginRole>("USER");

  const [showPassword, setShowPassword] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [error, setError] = useState("");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setError("");

    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }

    if (!password) {
      setError("Please enter your password.");
      return;
    }

    try {
      setIsSubmitting(true);

      const loggedInUser = await login(email.trim(), password);

      /*
       * Backend is authoritative for role.
       * We only use the dropdown as a user-facing check.
       */
      if (loggedInUser.role !== selectedRole) {
        await import("../../context/AuthContext").then(async () => {
          // Login succeeded, but selected role doesn't match.
        });

        setError(
          `This account belongs to the ${loggedInUser.role} role. Please select the correct role.`,
        );

        return;
      }

      /*
       * Successful login.
       */
      window.location.href = "/dashboard";
    } catch (err: any) {
      const message =
        err.response?.data?.message || "Invalid email or password.";

      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex w-full items-center justify-center bg-gradient-to-br from-[#F8FAFF] to-[#EEF2FF] px-8 py-10 lg:w-[52%]">
      <div className="w-full max-w-lg">
        <h1 className="text-4xl font-bold text-gray-900">Welcome back</h1>

        <p className="mt-2 text-gray-500">
          Sign in to access the booking system
        </p>

        <form onSubmit={handleSubmit} className="mt-8">
          {/* Role */}

          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              ROLE
            </label>

            <RoleDropdown value={selectedRole} onChange={setSelectedRole} />
          </div>

          {/* Email */}

          <div className="mt-5">
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              EMAIL ADDRESS
            </label>

            <InputField
              name="email"
              icon={<FaEnvelope />}
              type="email"
              placeholder="your.email@uni.edu"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              disabled={isSubmitting}
            />
          </div>

          {/* Password */}

          <div className="mt-5">
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              PASSWORD
            </label>

            <InputField
              name="password"
              icon={<FaLock />}
              rightIcon={
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="cursor-pointer"
                >
                  <FaEye />
                </button>
              }
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              disabled={isSubmitting}
            />
          </div>

          {/* Error */}

          {error && (
            <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}

          {/* Submit */}

          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-8 h-14 w-full rounded-2xl bg-[#5B1E1D] text-lg font-semibold text-white shadow-lg transition-all duration-300 hover:bg-[#4A1616] hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:scale-100"
          >
            {isSubmitting ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}
