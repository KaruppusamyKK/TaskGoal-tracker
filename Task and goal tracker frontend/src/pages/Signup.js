import { useState } from "react";
import { ApiService } from '../apiHandler/ApiService.js';
import { useNavigate } from "react-router-dom";
import ToastService from '../components/ToastService.js';

export default function SignupPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = { name: fullName, username, email, password };
      const responseMessage = await ApiService.registerUser(data);
      
      if (responseMessage.status === 200 && responseMessage.data === "User registered successfully!") {
        localStorage.setItem("jwtToken", responseMessage.data);
        localStorage.setItem("user", data.username);
        navigate("/home");
      }
    } catch (error) {
      console.error("❌ Signup Failed:", error);
      const errorMessage = error?.error || "Signup failed. Please try again.";
      ToastService.error(errorMessage);
    }
  };
  

  return (
    <div className="flex min-h-screen w-full items-center justify-center">
      <div className="w-full max-w-md border border-gray-300 rounded-lg p-6 shadow-sm">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold">Create an account</h1>
          <p className="mt-2 text-muted-foreground">Enter your information to get started</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">Full Name</label>
            <input
              id="fullName"
              type="text"
              placeholder="karuppu"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="username" className="block text-sm font-medium text-gray-700">Username</label>
            <input
              id="username"
              type="text"
              placeholder="karuppu123"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
            <input
              id="email"
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Create a strong password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full p-2 border border-gray-300 rounded-md"
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "🙈" : "👁️"}
              </button>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <input type="checkbox" id="terms" required className="h-4 w-4 text-blue-500" />
            <label htmlFor="terms" className="text-sm font-normal">
              I agree to the{" "}
              <a href="/terms" className="text-blue-500 hover:underline">Terms of Service</a> and{" "}
              <a href="/privacy" className="text-blue-500 hover:underline">Privacy Policy</a>
            </label>
          </div>

          <button type="submit" className="w-full p-2 bg-blue-500 text-white rounded-md">
            Create account
          </button>
        </form>
      </div>
    </div>
  );
}
