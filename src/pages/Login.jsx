import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`http://localhost:3001/users?email=${email}`);
      const data = await res.json();

      if (data.length === 0) {
        toast.error("User not found!", { autoClose: 2000 });
        return;
      }

      const user = data[0];

      if (user.password !== password) {
        toast.error("Incorrect password!", { autoClose: 2000 });
        return;
      }

      // Save user info in localStorage
      localStorage.setItem("user", JSON.stringify(user));

      toast.success("Login Successful!", { autoClose: 1500 });

      setTimeout(() => {
        navigate("/");
      }, 1500);

    } catch (error) {
      toast.error("Something went wrong!");
      console.log(error);
    }
  };

  return (
    <>
      <ToastContainer />

      <div
        className="flex justify-center items-center min-h-screen bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage:
            "url('https://img.freepik.com/free-photo/abstract-colorful-watercolor-card_23-2147835862.jpg')",
        }}
      >
        <div className="bg-white/80 backdrop-blur-md p-8 rounded-2xl shadow-2xl w-[90%] max-w-md">
          <h2 className="text-3xl font-extrabold text-center mb-6 text-orange-600 drop-shadow-md">
            Welcome Back 🎨
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block font-medium mb-1 text-gray-700">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-orange-500"
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label className="block font-medium mb-1 text-gray-700">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-orange-500"
                placeholder="Enter your password"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-3 rounded-lg transition-all duration-300 shadow-lg"
            >
              Login
            </button>
          </form>

          <div className="my-5 text-center text-gray-500">OR</div>

          <p className="text-center text-gray-700">
            Not registered?
            <Link
              to="/Register"
              className="text-orange-600 font-semibold ml-1 hover:underline"
            >
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}
