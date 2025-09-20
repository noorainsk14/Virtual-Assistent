import React, { useContext } from "react";
import UserDataContext from "../../context/userContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Home = () => {
  const { userData, serverUrl, setUserData } = useContext(UserDataContext);
  const navigate = useNavigate();

  const handleLogOut = async () => {
    try {
      const result = await axios.get(`${serverUrl}/auth/logout`, {
        withCredentials: true,
      });
      navigate("/sign-in");
      console.log(result);
    } catch (error) {
      console.log(error);
    } finally {
      setUserData(null);
    }
  };

  return (
    <div className="w-full h-[100vh] bg-gradient-to-t from-[black] to-[#02023d] flex justify-center items-center flex-col gap-[15px]">
      <button
        className="min-w-[150px] h-[60px] mt-[30px] text-black font-semibold absolute top-[20px] right-[20px] bg-white rounded-full cursor-pointer text-[19px]"
        onClick={handleLogOut}
      >
        Log Out
      </button>
      <button
        className="min-w-[150px] h-[60px] mt-[30px] text-black font-semibold bg-white absolute  top-[100px] right-[20px] cursor-pointer rounded-full text-[19px] px-[20px] py-[10px]"
        onClick={() => {
          navigate("/customize");
        }}
      >
        Customize
      </button>

      <div className="w-[300px] h-[400px] flex justify-center items-center overflow-hidden rounded-4xl shadow-lg">
        {userData?.assistantImage ? (
          <img
            src={userData.assistantImage}
            alt="assistantImage"
            className="h-full object-cover"
          />
        ) : (
          <div className="text-white">No Assistant Image</div>
        )}
      </div>
      <h1 className="text-white text-[18px] font-semibold">
        I'm {userData?.assistantName}
      </h1>
    </div>
  );
};

export default Home;
