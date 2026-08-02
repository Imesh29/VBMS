import { FaCarSide, FaCheckCircle } from "react-icons/fa";

export default function LeftPanel() {
  return (
      <div className="relative hidden lg:flex lg:w-[48%] bg-[#5B1E1D] text-white overflow-hidden">

      {/* Background Circles */}
      <div className="absolute -top-20 right-[-70px] w-72 h-72 rounded-full bg-white/5"></div>

      <div className="absolute bottom-64 right-10 w-40 h-40 rounded-full bg-white/5"></div>

      <div className="absolute -bottom-24 -left-20 w-56 h-56 rounded-full bg-white/5"></div>

      {/* Content */}
      <div className="relative z-10 flex flex-col justify-between h-full w-full p-10">

        {/* Logo */}
        <div>
          <div className="flex items-center gap-3">

            <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">

              <FaCarSide className="text-xl" />

            </div>

            <div>
              <h2 className="font-bold text-xl">
                VBMS
              </h2>

              <h3 className="text-sm text-gray-300">
                Vehicle Booking Management System
              </h3>

            </div>

          </div>

          {/* Heading */}

          <div className="mt-16">

              <h1 className="text-4xl xl:text-5xl font-bold leading-tight">
            <br></br><br></br>
              University Vehicle
              <br />
              Services Portal

            </h1>
            <br></br>
            <p className="mt-6 text-lg leading-8 text-gray-300 max-w-md">

              Streamlined vehicle booking management
              for staff, Faculty Deans and the Vehicle
              Management Department.

            </p>

          </div>

        </div>

        {/* Features */}

        <div>

          <div className="space-y-5">

            <div className="flex items-center gap-3">

              <FaCheckCircle className="text-green-300" />

              <span>
                Submit and track vehicle booking requests
              </span>

            </div>

            <div className="flex items-center gap-3">

              <FaCheckCircle className="text-green-300" />

              <span>
                Multi-level approval workflow (Dean → Admin)
              </span>

            </div>

            <div className="flex items-center gap-3">

              <FaCheckCircle className="text-green-300" />

              <span>
                Real-time fleet availability and status
              </span>

            </div>

          </div>

          <div className="border-t border-white/10 mt-8 pt-6">

            <p className="text-sm text-gray-400">
              © 2026 University Vehicle Services.
              All rights reserved.
            </p>

          </div>

        </div>

      </div>

    </div>
  );
}