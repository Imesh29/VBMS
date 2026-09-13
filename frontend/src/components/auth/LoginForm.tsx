import { useState } from "react";
import {
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaArrowRight,
} from "react-icons/fa";
import { Link } from "react-router-dom";

import InputField from "../common/InputField";
import { useAuth } from "../../context/AuthContext";

export default function LoginForm() {
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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

      // The backend authenticates the credentials and returns the user's real role.
      // No role is selected or trusted on the login screen.
      await login(email.trim(), password);

      // Existing ProtectedRoute/role-aware UI continues to use the role returned
      // by the backend, so USER, DEAN and ADMIN are routed to their own features.
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
    <div className="flex min-h-screen w-full items-center justify-center bg-gradient-to-br from-[#F8FAFF] via-[#F6F8FC] to-[#EEF2FF] px-6 py-10 lg:w-[52%] lg:px-12">
      <div className="w-full max-w-[560px]">
        <div className="mb-9">
          <div
            className="mb-3 inline-flex items-center rounded-full border border-[#5B1E1D]/10 bg-[#5B1E1D]/[0.05] px-3 py-1.5 text-xs font-semibold tracking-wide text-[#5B1E1D]"
            style={{ padding: "10px", marginBottom: "12px" }}
          >
            UNIVERSITY VEHICLE BOOKING SYSTEM
          </div>

          <h1 className="text-4xl font-bold leading-tight tracking-tight text-gray-900 sm:text-[42px]">
            Welcome back
          </h1>

          <p
            className="mt-2 text-base leading-6 text-gray-500"
            style={{ marginBottom: "12px" }}
          >
            Sign in with your university account to continue to VBMS.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-[28px] border border-white/80 bg-white/70 p-7 shadow-[0_18px_55px_rgba(31,41,55,0.08)] backdrop-blur-sm sm:p-8"
          style={{ padding: "15px" }}
        >
          <div>
            <label className="mb-2.5 block text-sm font-semibold tracking-wide text-gray-700">
              EMAIL ADDRESS
            </label>

            <div className="h-[68px]">
              <InputField
                name="email"
                icon={<FaEnvelope />}
                type="email"
                placeholder="your.email@uni.edu.lk"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                disabled={isSubmitting}
              />
            </div>
          </div>

          <div className="mt-6">
            <label className="mb-2.5 block text-sm font-semibold tracking-wide text-gray-700">
              PASSWORD
            </label>

            <div className="h-[68px]">
              <InputField
                name="password"
                icon={<FaLock />}
                rightIcon={
                  <button
                    type="button"
                    onClick={() => setShowPassword((current) => !current)}
                    className="cursor-pointer text-gray-400 transition-colors hover:text-gray-600"
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                }
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                disabled={isSubmitting}
              />
            </div>
          </div>

          {error && (
            <div className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-7 flex h-[54px] w-full items-center justify-center gap-2 rounded-2xl bg-[#5B1E1D] text-base font-semibold text-white shadow-[0_8px_22px_rgba(91,30,29,0.18)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#4A1616] hover:shadow-[0_12px_26px_rgba(91,30,29,0.22)] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
          >
            {isSubmitting ? (
              "Signing in..."
            ) : (
              <>
                Sign In
                <FaArrowRight className="text-sm" />
              </>
            )}
          </button>

          <p
            className="mt-6 text-center text-sm text-gray-500"
            style={{ marginTop: "12px" }}
          >
            New to VBMS?{" "}
            <Link
              to="/register"
              className="font-semibold text-[#5B1E1D] transition-colors hover:text-[#431313] hover:underline"
            >
              Create an account
            </Link>
          </p>
        </form>

        <p
          className="mt-5 text-center text-xs leading-5 text-gray-400"
          style={{ marginTop: "12px" }}
        >
          Staff, Faculty Deans and Administrators can sign in using their
          registered email and password.
        </p>
      </div>
    </div>
  );
}
