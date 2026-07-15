import "./App.css";
import LeftPanel from "./components/LeftPanel";
import LoginForm from "./components/LoginForm";

function App() {
  return (
    <div className="container">
      <LeftPanel />
      <LoginForm />
    </div>
  );
}

export default App;