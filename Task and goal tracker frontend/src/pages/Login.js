import { useState } from "react";
import { ApiService } from '../apiHandler/ApiService.js';
import ToastService from '../components/ToastService';
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [name, setName] = useState("")
  const [password, setPassword] = useState("")
  const navigate = useNavigate();


  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Login attempt with:", { name, password });
  
    try {
      const data = { username: name, password: password };
      const responseMessage = await ApiService.authenticateUser(data);
      console.log("✅ Login Successful:", responseMessage.data);
      if(responseMessage.status===200){
        localStorage.setItem('jwtToken', responseMessage.data);
        localStorage.setItem('user', data.username);
        navigate('/home');

      }
      
  
    } catch (errorMessage) {
      console.error("❌ Login Failed:", errorMessage);
      ToastService.error(errorMessage);
    }
  };
  

  return (
    <div className="flex min-h-screen w-full items-center justify-center">
      <div className="w-full max-w-md border border-gray-300 rounded-lg p-6 shadow-sm">
        <div className="mb-8 mt-4 text-center">
          <h1 className="text-3xl font-bold">Welcome back</h1>
          <p className="mt-2 text-muted-foreground">Enter your credentials to access your account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
            <input
              id="name"
              type="name"
              placeholder="karuppu"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
              <a href="/forgot-password" className="text-sm text-blue-500 hover:underline">
                Forgot password?
              </a>
            </div>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full p-2 border border-gray-300 rounded-md"
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "🙈" : "👁️"}
              </button>
            </div>
          </div>
          <button type="submit" className="w-full p-2 bg-blue-500 text-white rounded-md">
            Sign in
            <span className="ml-2 h-4 w-4">➡️</span>
          </button>
        </form>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-white px-2 text-muted-foreground">Or continue with</span>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-4">
            <button className="w-full p-2 border border-gray-300 rounded-md">
              Google
            </button>
            <button className="w-full p-2 border border-gray-300 rounded-md">
              GitHub
            </button>
          </div>
        </div>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Don't have an account? {" "}
          <a href="/signup" className="text-blue-500 hover:underline">
            Sign up
          </a>
        </p>
      </div>
    </div>
  )
}