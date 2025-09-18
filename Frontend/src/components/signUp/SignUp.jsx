import React, { useContext, useState } from "react";
import bg from "../../assets/authBg.png";
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

import axios from "axios";
import UserDataContext from "../../context/userContext";
const SignUp = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { serverUrl } = useContext(UserDataContext);
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignUp = async (e) => {
    e.preventDefault();
    try {
      console.log("Using serverUrl:", serverUrl);
      const response = await axios.post(
        `${serverUrl}/auth/signup`,
        {
          username,
          email,
          password,
        },
        { withCredentials: true }
      );
      console.log(response.data);
    } catch (error) {
      console.log(error.message);
    }
  };
  return (
    <div
      className="w-full h-[100vh] bg-cover flex justify-center items-center"
      style={{ backgroundImage: `url(${bg})` }}
    >
      <form
        onSubmit={handleSignUp}
        className="w-[90%] h-[600px] max-w-[500px] bg-[#00000062] backdrop-blur shadow-lg shadow-black flex flex-col items-center justify-center gap-[20px] px-[20px]"
      >
        <h1 className="text-white text-[30px] font-semibold mb-[30px]">
          Register to <span className="text-blue-400">Virtual Assistant</span>
        </h1>
        <input
          type="text"
          placeholder="Enter Your Username "
          className="w-full h-[60px] outline-none  border-2 border-white bg-transparent text-white placeholder-gray-300 px-[20px] py-[10px] rounded-full text-[18px]"
          required
          onChange={(e) => setUsername(e.target.value)}
          value={username}
        />
        <input
          type="text"
          placeholder="Enter Your Email "
          className="w-full h-[60px] outline-none  border-2 border-white bg-transparent text-white placeholder-gray-300 px-[20px] py-[10px] rounded-full text-[18px]"
          required
          onChange={(e) => setEmail(e.target.value)}
          value={email}
        />
        <div className="w-full h-[60px] border-2 border-white bg-transparent text-white rounded-full text-[18px] relative">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Enter Your Password "
            className="w-full h-full rounded-full outline-none text-[18px] bg-transparent placeholder-gray-300 px-[20px] py-[10px]"
            required
            onChange={(e) => setPassword(e.target.value)}
            value={password}
          />
          {!showPassword && (
            <FaEye
              className="absolute top-[18px] right-[18px] w-[25px] h-[25px] text-[white] cursor-pointer"
              onClick={() => setShowPassword(true)}
            />
          )}
          {showPassword && (
            <FaEyeSlash
              className="absolute top-[18px] right-[18px] w-[25px] h-[25px] text-[white] cursor-pointer"
              onClick={() => setShowPassword(false)}
            />
          )}
        </div>
        <button
          type="submit"
          className="min-w-[150px] h-[60px] mt-[30px] text-black font-semibold bg-white rounded-full text-[19px]"
        >
          Sign Up
        </button>
        <p
          className="text-white text-[18px] cursor-pointer"
          onClick={() => {
            navigate("/sign-in");
          }}
        >
          Already have an account ?{" "}
          <span className="text-blue-400">Sign In</span>
        </p>
      </form>
    </div>
  );
};

export default SignUp;
