import React, { useContext, useState } from "react";
import UserDataContext from "../../context/userContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { MdKeyboardBackspace } from "react-icons/md";

const Customize2 = () => {
  const { userData, backEndImage, selectedImage, serverUrl, setUserData } =
    useContext(UserDataContext);
  const [assistantName, setAssistantName] = useState(
    userData?.assistantName || ""
  );

  const [loading, setLoading] = useState(false);

  const handleUpdateAssistant = async () => {
    setLoading(true);
    try {
      let formData = new FormData();
      formData.append("assistantName", assistantName);

      if (backEndImage && backEndImage instanceof File) {
        formData.append("assistantImage", backEndImage);
      } else if (selectedImage && selectedImage !== "input") {
        formData.append("imageUrl", selectedImage);
      } else {
        console.warn("No valid image selected.");
        return;
      }
      const result = await axios.post(`${serverUrl}/update`, formData, {
        withCredentials: true,
      });

      setLoading(false);
      console.log(result.data);
      setUserData(result.data);
      navigate("/");
    } catch (error) {
      setLoading(false);

      console.log(error);
    }
  };

  const navigate = useNavigate();
  return (
    <div className="w-full h-[100vh] bg-gradient-to-t from-[black] to-[#030353] flex justify-center items-center flex-col p-[20px] relative">
      <MdKeyboardBackspace
        className="absolute top-[30px] left-[30px] text-white w-[25px] h-[25px] cursor-pointer"
        onClick={() => {
          navigate("/customize");
        }}
      />
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
          className="min-w-[150px] h-[60px] mt-[30px] text-black font-semibold bg-white rounded-full text-[19px] cursor-pointer p-3 "
          disabled={loading}
          onClick={() => {
            handleUpdateAssistant();
            navigate("/");
          }}
        >
          {!loading ? "Finally create your assistant" : "Loading..."}
        </button>
      )}
    </div>
  );
};

export default Customize2;
