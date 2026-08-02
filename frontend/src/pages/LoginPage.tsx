import LeftPanel from "../components/auth/LeftPanel";
import LoginForm from "../components/auth/LoginForm";

export default function Login() {
  return (
    <div className="flex min-h-screen bg-[#F6F8FC]">
      <LeftPanel />
      <LoginForm />
    </div>
  );
}
