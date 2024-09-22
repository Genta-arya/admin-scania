import React, { useEffect, useState } from "react";
import { handleLogin } from "./../../service/API/authentikasi/_serviceAuthentikasi";
import handleError from "../../utils/HandleError";
import LoadingButton from "../../components/LoadingButton";
import { toast, Toaster } from "sonner";
import { useNavigate } from "react-router-dom";

const AuthPage = () => {
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false); 
  const [username, setUsername] = useState(""); 
  const navigate = useNavigate();

  useEffect(() => {
    
    const savedUsername = localStorage.getItem("username");
    if (savedUsername) {
      setUsername(savedUsername);
      setRememberMe(true); 
    }


    const token = localStorage.getItem("token");
    if (token) {
      localStorage.removeItem("token");
    }
  }, []);

  const handleLoginSubmit = async (event) => {
    event.preventDefault();
    const usernameInput = event.target.username.value;
    const password = event.target.password.value;

    setLoading(true);
    try {
      const response = await handleLogin({ username: usernameInput, password });

      if (response && response.token) {
        localStorage.setItem("token", response.token);

        if (rememberMe) {
          localStorage.setItem("username", usernameInput);
        } else {
          localStorage.removeItem("username");
        }

        toast.success("Login successful");
        navigate("/");
      }
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  };

  const handleRememberMeChange = (e) => {
    setRememberMe(e.target.checked); // Update rememberMe ketika checkbox berubah
  };

  const handleUsernameChange = (e) => {
    setUsername(e.target.value); // Update state username
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-800">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">
          Login to Your Account
        </h2>
        <form className="space-y-6" onSubmit={handleLoginSubmit}>
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-700"
            >
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={username}
              onChange={handleUsernameChange}
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none"
              placeholder="Username"
              required
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none"
              placeholder="********"
              required
            />
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                checked={rememberMe}
                onChange={handleRememberMeChange}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label
                htmlFor="remember-me"
                className="ml-2 block text-sm text-gray-700"
              >
                Save username
              </label>
            </div>
          </div>

          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-white bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <LoadingButton loading={loading} text="Sign in" />
          </button>
        </form>
      </div>
      <Toaster richColors position="top-center" />
    </div>
  );
};

export default AuthPage;
