import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import AlertModal from "../alert-modal/AlertModal";

const Login = () => {
  const LOGIN_API_URL =
    "https://script.google.com/macros/s/AKfycbxS5YBA07r4Xnn1WI-MRt0fDZr6FMzewjMn4oMf8KxRtZyOa8ww4zTTbuYt40LEi-ih-w/exec";

  const [alert, setAlert] = useState({
    open: false,
    title: "",
    message: "",
    type: "info",
  });

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("login")) {
      navigate("/");
    }
  }, []);

  const handleLogin = async () => {
    if (!email || !password) {
      setAlert({
        open: true,
        title: "Incorrect Email and Password",
        message: "Please enter email & password",
        type: "info",
      });
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(LOGIN_API_URL, {
        method: "POST",
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await res.json();

      if (data.status === "success") {
        localStorage.setItem("user", JSON.stringify(data.user));
        localStorage.setItem("login", "true");

        setAlert({
          open: true,
          title: "Login Successful",
          message: "Welcome back 👋",
          type: "info",
        });

        // delay navigation so user sees modal
        setTimeout(() => {
          navigate("/");
        }, 2000);
      } else {
        setAlert({
          open: true,
          title: "Login Failed",
          message: "Invalid credentials",
          type: "info",
        });
      }
    } catch (err) {
      setAlert({
        open: true,
        title: "Login Error",
        message: "Error while logging in",
        type: "info",
      });
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white border border-gray-200 rounded-xl p-8 shadow-lg text-gray-800">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-semibold">Welcome Back</h1>
          <p className="text-gray-500 text-sm mt-2">Login to your dashboard</p>
        </div>

        {/* Email */}
        <div className="mb-4">
          <label className="text-gray-800">Email</label>
          <div className="flex items-center mt-1 border border-gray-300 rounded-md px-3 bg-gray-50 focus-within:border-blue-500">
            <Mail className="text-gray-400" />
            <input
              type="email"
              placeholder="Enter email"
              className="w-full px-2 py-2 bg-transparent outline-none font-medium"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        </div>

        {/* Password */}
        <div className="mb-6">
          <label className="text-gray-800">Password</label>
          <div className="flex items-center mt-1 border border-gray-300 rounded-md px-3 bg-gray-50 focus-within:border-blue-500">
            <Lock className="text-gray-400" />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter password"
              className="w-full px-2 py-2 bg-transparent outline-none font-medium"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            {/* 👁 Toggle Button */}
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-gray-400 hover:text-gray-600 cursor-pointer"
            >
              {showPassword ? <EyeOff /> : <Eye />}
            </button>
          </div>
        </div>

        {/* Button */}
        <button
          onClick={handleLogin}
          className="w-full py-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white transition-all font-medium cursor-pointer"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        {/* Footer */}
        <p className="text-xs text-gray-400 text-center mt-6">
          Powered by Quality Power Tools
        </p>

        <AlertModal
          isOpen={alert.open}
          title={alert.title}
          message={alert.message}
          type={alert.type}
          onConfirm={() => setAlert({ ...alert, open: false })}
        />
      </div>
    </div>
  );
};

export default Login;
