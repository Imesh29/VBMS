import { Link } from "react-router-dom";
import { FaArrowLeft, FaCarSide } from "react-icons/fa";

export default function RegisterLeftPanel() {
  return (
    <section
      className="
        relative
        hidden
        min-h-screen
        overflow-hidden

        bg-[#5B1E1D]
        text-white

        lg:flex
        lg:w-[48%]
      "
    >
      {/* =====================================================
          DECORATIVE BACKGROUND
      ====================================================== */}

      {/* Top-right circle */}
      <div
        className="
          absolute
          -right-[95px]
          -top-[95px]

          h-[350px]
          w-[350px]

          rounded-full

          bg-white/[0.045]
        "
      />

      {/* Bottom-right circle */}
      <div
        className="
          absolute
          -bottom-[35px]
          right-[15px]

          h-[200px]
          w-[200px]

          rounded-full

          bg-white/[0.045]
        "
      />

      {/* Bottom-left circle */}
      <div
        className="
          absolute
          -bottom-[125px]
          -left-[115px]

          h-[310px]
          w-[310px]

          rounded-full

          bg-white/[0.045]
        "
      />

      {/* =====================================================
          MAIN CONTENT
      ====================================================== */}

      <div
        className="
          relative
          z-10
        
          flex
          min-h-screen
          w-full
          flex-col
        "
        style={{
          paddingTop: "42px",
          paddingLeft: "50px",
          paddingRight: "50px",
          paddingBottom: "38px",
        }}
      >
        {/* =================================================
            BACK TO SIGN IN
        ================================================== */}

        <Link
          to="/"
          className="
    inline-flex
    w-fit
    items-center
    gap-3
    text-sm
    font-medium
    text-white/55
    transition-colors
    hover:text-white
  "
        >
          <FaArrowLeft className="text-xs" />
          <span>Back to Sign In</span>
        </Link>

        {/* =================================================
            BRAND
        ================================================== */}

        <div
          className="
    flex
    items-center
    gap-4
  "
          style={{
            marginTop: "30px",
          }}
        >
          {/* Logo */}
          <div
            className="
      flex
      h-12
      w-12
      shrink-0
      items-center
      justify-center
      rounded-full
      bg-white/[0.12]
    "
          >
            <FaCarSide className="text-xl text-white" />
          </div>

          {/* Brand */}
          <div>
            <h2
              className="
        text-[20px]
        font-bold
        leading-none
        tracking-tight
      "
            >
              VBMS
            </h2>

            <p
              className="
        text-[14px]
        leading-none
        text-white/45
      "
              style={{
                marginTop: "9px",
              }}
            >
              Vehicle Booking Mgmt
            </p>
          </div>
        </div>
        {/* =================================================
            HERO CONTENT
        ================================================== */}

        <div
          className="
            max-w-[470px]
          "
          style={{
            marginTop: "58px",
          }}
        >
          <h1
            className="
              text-[42px]
              font-bold
              leading-[1.22]
              tracking-[-0.8px]

              text-white
            "
          >
            Join the
            <br />
            Booking System
          </h1>

          <p
            className="
              mt-6

              max-w-[430px]

              text-[18px]
              font-normal
              leading-[1.6]

              text-white/55
            "
            style={{
              marginTop: "40px",
            }}
          >
            Register your staff account to start requesting university vehicle
            bookings for your department.
          </p>
        </div>
      </div>
    </section>
  );
}
