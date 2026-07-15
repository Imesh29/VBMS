import {
  FaUserCircle,
  FaEnvelope,
  FaLock,
  FaEye
} from "react-icons/fa";

import DemoCard from "./DemoCard";

function LoginForm() {

  return (

    <div className="right-panel">

      <div className="login-box">

        <h1>Welcome back</h1>

        <p>Sign in to access the booking system</p>

        <label>ROLE</label>

        <div className="input">

          <FaUserCircle />

          <select>

            <option>Staff / Lecturer</option>

            <option>Faculty Dean</option>

            <option>Admin</option>

          </select>

        </div>

        <label>Email Address</label>

        <div className="input">

          <FaEnvelope />

          <input
            type="email"
            placeholder="your.email@uni.edu.my"
          />

        </div>

        <label>Password</label>

        <div className="input">

          <FaLock />

          <input
            type="password"
            placeholder="Enter password"
          />

          <FaEye />

        </div>

        <button>Sign In</button>   

      </div>

    </div>

  );
}

export default LoginForm;