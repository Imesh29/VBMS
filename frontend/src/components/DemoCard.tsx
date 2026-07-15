function DemoCard({ title, email, password }) {
  return (
    <div className="demo-card">

      <div>

        <h4>{title}</h4>

        <p>{email}</p>

      </div>

      <div className="password">

        <span>{password}</span>

        <small>click to autofill</small>

      </div>

    </div>
  );
}

export default DemoCard;