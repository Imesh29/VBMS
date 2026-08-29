import { useState, type ChangeEvent, type ReactNode } from "react";
import { useNavigate, Link } from "react-router-dom";

import {
  FaUserCircle,
  FaEnvelope,
  FaBuilding,
  FaLock,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";

import { register } from "../../api/authApi";
import { DEPARTMENTS } from "../../constants/departments";

/* =========================================================
   Reusable Input Field Props
========================================================= */

interface PillFieldProps {
  icon: ReactNode;
  rightIcon?: ReactNode;
  type: string;
  placeholder: string;
  value: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  name?: string;
  disabled?: boolean;
}

/* =========================================================
   Reusable Input Field

   All text inputs use the same:
   - Width
   - Height
   - Border radius
   - Padding
   - Focus state
   - Typography
========================================================= */

function PillField({
  icon,
  rightIcon,
  type,
  placeholder,
  value,
  onChange,
  name,
  disabled,
}: PillFieldProps) {
  return (
    <div
      className="
        flex
        w-full
        items-center

        rounded-full

        border
        border-gray-200

        bg-white

        px-5

        shadow-sm

        transition-all
        duration-200

        focus-within:border-[#5B1E1D]
        focus-within:ring-4
        focus-within:ring-[#5B1E1D]/10

        hover:border-gray-300
      "
      style={{
        /* Explicit height so the field height is always 58px.
           This does not affect the width. */
        height: "58px",
      }}
    >
      {/* Left-side field icon */}
      <span className="mr-3 shrink-0 text-[17px] text-gray-400">{icon}</span>

      {/* Main input */}
      <input
        name={name}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className="
          min-w-0
          flex-1

          bg-transparent

          text-[15px]
          font-medium
          text-gray-700

          outline-none

          placeholder:text-gray-400
          placeholder:font-normal

          disabled:cursor-not-allowed
          disabled:opacity-60
        "
      />

      {/* Optional right-side icon.
          Used for password visibility toggle. */}
      {rightIcon && (
        <span className="ml-3 flex shrink-0 items-center text-gray-400">
          {rightIcon}
        </span>
      )}
    </div>
  );
}

/* =========================================================
   Register Form
========================================================= */

export default function RegisterForm() {
  const navigate = useNavigate();

  /* -------------------------------------------------------
     Form State
  ------------------------------------------------------- */

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [department, setDepartment] = useState("");
  const [password, setPassword] = useState("");

  /* -------------------------------------------------------
     UI State
  ------------------------------------------------------- */

  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  /* =======================================================
     Submit Registration
  ======================================================= */

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setError("");

    /* -----------------------------------------------------
       Basic Client-side Validation
    ----------------------------------------------------- */

    if (!fullName.trim()) {
      setError("Please enter your full name.");
      return;
    }

    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }

    if (!department) {
      setError("Please select your department.");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    /* -----------------------------------------------------
       Send Registration Request
    ----------------------------------------------------- */

    try {
      setIsSubmitting(true);

      await register({
        fullName: fullName.trim(),
        email: email.trim(),
        password,
        department,
      });

      setSuccess(true);

      /* Redirect to login after successful registration */
      setTimeout(() => {
        navigate("/", {
          state: {
            registered: true,
          },
        });
      }, 1500);
    } catch (err: any) {
      const message =
        err.response?.data?.message || "Could not create your account.";

      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  /* =======================================================
     Reusable Label Style

     The 10px margin creates a proper visual gap between
     the label and the input field.
  ======================================================= */

  const labelStyle = {
    marginBottom: "10px",
  };

  return (
    <div
      className="
        flex
        w-full
        items-center
        justify-center

        bg-[#F6F8FC]

        px-8
        py-10

        lg:w-[56%]
      "
    >
      <div className="w-full max-w-lg">
        {/* =================================================
            PAGE TITLE
        ================================================== */}

        <h1
          className="
            text-4xl
            font-bold
            tracking-tight
            text-gray-900
          "
        >
          Create Account
        </h1>

        <p
          className="
            mt-3
            text-[15px]
            leading-6
            text-gray-500
          "
        >
          Staff registration — role is set to{" "}
          <span className="font-semibold text-gray-700">Lecturer / Staff</span>{" "}
          by default
        </p>

        {/* =================================================
            SUCCESS MESSAGE
        ================================================== */}

        {success ? (
          <div
            className="
              mt-8

              rounded-2xl
              border
              border-emerald-200

              bg-emerald-50

              px-5
              py-4

              text-sm
              font-medium
              text-emerald-700

              shadow-sm
            "
          >
            Account created! Redirecting you to sign in...
          </div>
        ) : (
          /* =================================================
             REGISTRATION FORM
          ================================================= */

          <form onSubmit={handleSubmit} className="mt-8">
            {/* =================================================
                FULL NAME
            ================================================= */}

            <div style={{ marginBottom: "22px" }}>
              <label
                className="
                  block

                  text-sm
                  font-semibold
                  tracking-wide

                  text-gray-700
                "
                style={{ ...labelStyle, marginTop: "15px" }}
              >
                FULL NAME <span className="text-red-500">*</span>
              </label>

              <PillField
                name="fullName"
                icon={<FaUserCircle />}
                type="text"
                placeholder="e.g. Dr. Amirah Zainudin"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                disabled={isSubmitting}
              />
            </div>

            {/* =================================================
                EMAIL ADDRESS
            ================================================== */}

            <div style={{ marginBottom: "22px" }}>
              <label
                className="
                  block

                  text-sm
                  font-semibold
                  tracking-wide

                  text-gray-700
                "
                style={labelStyle}
              >
                EMAIL ADDRESS <span className="text-red-500">*</span>
              </label>

              <PillField
                name="email"
                icon={<FaEnvelope />}
                type="email"
                placeholder="your.name@uni.edu.my"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isSubmitting}
              />
            </div>

            {/* =================================================
                DEPARTMENT DROPDOWN
            ================================================== */}

            <div style={{ marginBottom: "22px" }}>
              <label
                className="
                  block

                  text-sm
                  font-semibold
                  tracking-wide

                  text-gray-700
                "
                style={labelStyle}
              >
                DEPARTMENT <span className="text-red-500">*</span>
              </label>

              <div
                className="
                  flex
                  w-full
                  items-center

                  rounded-full

                  border
                  border-gray-200

                  bg-white

                  px-5

                  shadow-sm

                  transition-all
                  duration-200

                  focus-within:border-[#5B1E1D]
                  focus-within:ring-4
                  focus-within:ring-[#5B1E1D]/10

                  hover:border-gray-300
                "
                style={{
                  height: "58px",
                }}
              >
                {/* Department icon */}
                <span
                  className="
                    mr-3
                    shrink-0

                    text-[17px]
                    text-gray-400
                  "
                >
                  <FaBuilding />
                </span>

                {/* Department select */}
                <select
                  name="department"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  disabled={isSubmitting}
                  className="
                    min-w-0
                    flex-1

                    cursor-pointer

                    bg-transparent

                    text-[15px]
                    font-medium
                    text-gray-700

                    outline-none

                    disabled:cursor-not-allowed
                    disabled:opacity-60
                  "
                >
                  <option value="" disabled>
                    Select your department
                  </option>

                  {DEPARTMENTS.map((dept) => (
                    <option key={dept} value={dept}>
                      {dept}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* =================================================
                PASSWORD
            ================================================== */}

            <div style={{ marginBottom: "22px" }}>
              <label
                className="
                  block

                  text-sm
                  font-semibold
                  tracking-wide

                  text-gray-700
                "
                style={labelStyle}
              >
                PASSWORD <span className="text-red-500">*</span>
              </label>

              <PillField
                name="password"
                icon={<FaLock />}
                rightIcon={
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isSubmitting}
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                    className="
                      flex
                      h-8
                      w-8
                      items-center
                      justify-center

                      rounded-full

                      text-gray-400

                      transition-all
                      duration-200

                      hover:bg-gray-100
                      hover:text-gray-600

                      disabled:cursor-not-allowed
                    "
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                }
                type={showPassword ? "text" : "password"}
                placeholder="Min. 8 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isSubmitting}
              />
            </div>

            {/* =================================================
                ERROR MESSAGE
            ================================================== */}

            {error && (
              <div
                className="
                  mb-5

                  rounded-xl

                  border
                  border-red-200

                  bg-red-50

                  px-4
                  py-3

                  text-sm
                  leading-5

                  text-red-600

                  shadow-sm
                "
              >
                {error}
              </div>
            )}

            {/* =================================================
                SUBMIT BUTTON
            ================================================== */}

            <button
              type="submit"
              disabled={isSubmitting}
              className="
                h-14
                w-full

                rounded-full

                bg-[#5B1E1D]

                text-base
                font-semibold
                text-white

                shadow-md

                transition-all
                duration-200

                hover:bg-[#4A1616]
                hover:shadow-lg

                active:scale-[0.99]

                disabled:cursor-not-allowed
                disabled:opacity-60
                disabled:hover:bg-[#5B1E1D]
                disabled:hover:shadow-md
              "
            >
              {isSubmitting ? "Creating account..." : "Create Account"}
            </button>

            {/* =================================================
                LOGIN LINK
            ================================================== */}

            <p
              className="
                mt-5

                text-center
                text-sm
                text-gray-500
              "
            >
              Already have an account?{" "}
              <Link
                to="/"
                className="
                  font-semibold
                  text-[#5B1E1D]

                  hover:underline
                "
              >
                Sign in
              </Link>
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
