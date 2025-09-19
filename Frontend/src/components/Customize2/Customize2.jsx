import React, { useContext, useState } from "react";
import UserDataContext from "../../context/userContext";
import { useNavigate } from "react-router-dom";

const Customize2 = () => {
  const { userData } = useContext(UserDataContext);
  const [assistantName, setAssistantName] = useState(
    userData?.assistantName || ""
  );
  const navigate = useNavigate();
  return (
    <div className="w-full h-[100vh] bg-gradient-to-t from-[black] to-[#030353] flex justify-center items-center flex-col p-[20px]">
      <h1 className="text-white mb-[40px] text-[30px] test-center">
        Enter Your <span className=" text-blue-200">Assistant Name</span>
      </h1>
      <input
        type="text"
        placeholder="eg.Nexi"
        className="w-full max-w-[600px] h-[60px] rounded-full outline-none text-[18px]  border-2  border-white text-white bg-transparent placeholder-gray-300 px-[20px] py-[10px] "
        required
        onChange={(e) => setAssistantName(e.target.value)}
      />
      {assistantName && (
        <button
          className="min-w-[150px] h-[60px] mt-[30px] text-black font-semibold bg-white rounded-full text-[19px] cursor-pointer p-3"
          onClick={() => navigate("/customize2")}
        >
          Finally create your assistant
        </button>
      )}
    </div>
  );
};

export default Customize2;
