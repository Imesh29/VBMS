import RoleDropdown from "./RoleDropdown";
import InputField from "./InputField";

import {
  FaEnvelope,
  FaLock,
  FaEye,
} from "react-icons/fa";

export default function LoginForm() {
  return (
    <div className="flex w-full lg:w-[52%] items-center justify-center bg-gradient-to-br from-[#F8FAFF] to-[#EEF2FF] px-8 py-10">

      <div className="w-full max-w-lg">

        {/* Heading */}

        <h1 className="text-4xl font-bold text-gray-900">
          Welcome back
        </h1>
        <br></br>

        <p className="mt-2 text-gray-500">
          Sign in to access the booking system
        </p>

        {/* Role */}

        <div className="mt-8">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            ROLE
          </label>
          <br></br>
          <RoleDropdown />
        </div>

        {/* Email */}

        <div className="mt-5">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            EMAIL ADDRESS
          </label>

          <InputField
            icon={<FaEnvelope />}
            type="email"
            placeholder="your.email@uni.edu.my"
          />
        </div>

        {/* Password */}

        <div className="mt-5">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            PASSWORD
          </label>

          <InputField
            icon={<FaLock />}
            rightIcon={<FaEye />}
            type="password"
            placeholder="Enter your password"
          />
        </div>

        {/* Button */}

     <br></br>

    <button
  className="mt-8 w-full h-14 rounded-2xl bg-[#5B1E1D] text-lg font-semibold text-white shadow-lg transition-all duration-300 hover:bg-[#4A1616] hover:scale-[1.02]">
    Sign In
  </button>

        {/* Demo */}

        <div className="my-8 flex items-center gap-5">
          <div className="h-px flex-1 bg-gray-300"></div>

          
          <div className="h-px flex-1 bg-gray-300"></div>
        </div>

        <div className="space-y-4">

        </div>

      </div>

    </div>
  );
}