import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Register() {
  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:3001/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      });

      if (res.ok) {
        alert("Registration Successful! 🎉");
        navigate("/login"); 
      } else {
        alert("Failed to Register. Try Again!");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Something went wrong!");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-yellow-200 to-orange-400"
    style={{backgroundImage: "url('https://img.freepik.com/free-photo/abstract-colorful-watercolor-card_23-2147835862.jpg?t=st=1764058237~exp=1764061837~hmac=56627827b1883ed2cd2de04779480bc7a8faf82c3d5aa10a35766b42e4d62823&w=1480')"}}
    >
      <div className="bg-white p-8 rounded-2xl shadow-2xl w-[90%] max-w-md">
        <h2 className="text-3xl font-extrabold text-center mb-6 text-orange-700 drop-shadow-md">
          Create Account 🖌️
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block font-medium text-gray-700 mb-1">Full Name</label>
            <input
              type="text"
              name="name"
              required
              value={user.name}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-orange-600"
              placeholder="Enter your full name"
            />
          </div>

          <div>
            <label className="block font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              name="email"
              required
              value={user.email}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-orange-600"
              placeholder="Enter your email"
            />
          </div>

          <div>
            <label className="block font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              name="password"
              required
              value={user.password}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-orange-600"
              placeholder="Create a strong password"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-3 rounded-lg transition-all duration-300 shadow-lg"
          >
            Register
          </button>
        </form>

        <div className="my-5 text-center text-gray-500">OR</div>

        <p className="text-center text-gray-700">
          Already have an account?
          <Link to="/login" className="text-orange-700 font-semibold ml-1 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
