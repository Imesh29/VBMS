import RegisterLeftPanel from "../components/auth/RegisterLeftPanel";
import RegisterForm from "../components/auth/RegisterForm";

export default function Register() {
  return (
    <div className="flex min-h-screen bg-[#F6F8FC]">
      <RegisterLeftPanel />
      <RegisterForm />
    </div>
  );
}
