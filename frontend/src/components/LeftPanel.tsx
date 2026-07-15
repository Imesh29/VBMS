import {
  FaCarSide,
  FaCheckCircle
} from "react-icons/fa";

function LeftPanel() {
  return (
    <div className="left-panel">

      <div className="logo">

        <div className="icon">
          <FaCarSide />
        </div>

        <div>
          <h3>VBMS</h3>
          <p>Vehicle Booking Mgmt</p>
        </div>

      </div>

      <div className="content">

        <h1>
          University Vehicle
          <br />
          Services Portal
        </h1>

        <p>
          Streamlined vehicle booking management
          for staff, Faculty Deans and Vehicle
          Management Department.
        </p>

      </div>

      <div className="features">
      

      </div>

    </div>
  );
}

export default LeftPanel;