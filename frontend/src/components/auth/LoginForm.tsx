import { useState } from "react";

import { FaEnvelope, FaLock, FaEye } from "react-icons/fa";

import RoleDropdown, { type LoginRole } from "./RoleDropdown";

import InputField from "../common/InputField";

import { useAuth } from "../../context/AuthContext";
import { Link } from "react-router-dom";

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
       */
      if (loggedInUser.role !== selectedRole) {
        setError(
          `This account belongs to the ${loggedInUser.role} role. Please select the correct role.`,
        );

        return;
      }

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
    <div
      className="
        flex
        min-h-screen
        w-full
        items-center
        justify-center

        bg-gradient-to-br
        from-[#F8FAFF]
        to-[#EEF2FF]

        px-6
        py-10

        lg:w-[52%]
        lg:px-10
      "
    >
      <div
        className="
          w-full
          max-w-[560px]
        "
      >
        {/* =====================================================
            HEADER
        ====================================================== */}

        <div className="mb-10 mt-20">
          <h1
            className="
              text-4xl
              font-bold
              leading-tight
              tracking-tight
              text-gray-900
            "
          >
            Welcome back
          </h1>

          <p
            className="
              mt-2
              text-base
              text-gray-400
              mb-6
            "
            style={{
              marginTop: "7px",
            }}
          >
            Sign in to access the booking system
          </p>
        </div>

        {/* =====================================================
            FORM
        ====================================================== */}

        <form onSubmit={handleSubmit}>
          {/* =================================================
              ROLE
          ================================================== */}

          <div className="relative">
            <label
              className="
                mb-3
                block

                text-sm
                font-semibold
                tracking-wide

                text-gray-700
              "
              style={{
                marginTop: "20px",
              }}
            >
              ROLE
            </label>

            <RoleDropdown value={selectedRole} onChange={setSelectedRole} />
          </div>

          {/* =================================================
              EMAIL
          ================================================== */}

          <div className="mt-7">
            <label
              className="
                mb-3
                block

                text-sm
                font-semibold
                tracking-wide

                text-gray-700
              "
            >
              EMAIL ADDRESS
            </label>

            <div className="h-[68px]">
              <InputField
                name="email"
                icon={<FaEnvelope />}
                type="email"
                placeholder="your.email@uni.edu.my"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                disabled={isSubmitting}
              />
            </div>
          </div>

          {/* =================================================
              PASSWORD
          ================================================== */}

          <div className="mt-7">
            <label
              className="
                mb-3
                block

                text-sm
                font-semibold
                tracking-wide

                text-gray-700
              "
            >
              PASSWORD
            </label>

            <div className="h-[68px]">
              <InputField
                name="password"
                icon={<FaLock />}
                rightIcon={
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="
                      cursor-pointer
                      text-gray-400
                      transition-colors
                      hover:text-gray-600
                    "
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
          </div>

          {/* =================================================
              ERROR
          ================================================== */}

          {error && (
            <div
              className="
                mt-5

                rounded-xl
                border
                border-red-200

                bg-red-50

                px-4
                py-3

                text-sm
                text-red-600
              "
            >
              {error}
            </div>
          )}

          {/* =================================================
              SIGN IN
          ================================================== */}

          <button
            type="submit"
            disabled={isSubmitting}
            className="
              mt-7

              h-[52px]
              w-full

              rounded-3xl

              bg-[#5B1E1D]

              text-base
              font-semibold
              text-white

              shadow-sm

              transition-all
              duration-200

              hover:bg-[#4A1616]

              disabled:cursor-not-allowed
              disabled:opacity-60
            "
          >
            {isSubmitting ? "Signing in..." : "Sign In"}
          </button>

          {/* Register link */}

          <p className="h-[20px] mt-6 text-center text-sm text-gray-500">
            New to VBMS?{" "}
            <Link
              to="/register"
              className="font-semibold text-[#5B1E1D] hover:underline"
            >
              Create an account
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
