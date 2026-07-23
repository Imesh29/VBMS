import LeftPanel from "./components/LeftPanel";
import LoginForm from "./components/LoginForm";

export default function Login() {
  return (
    <div className="flex min-h-screen bg-[#F6F8FC]">
      <LeftPanel />
      <LoginForm />
    </div>
  );
}