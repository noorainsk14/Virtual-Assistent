import React, { useEffect, useState } from "react";
import axios from "axios";
import UserDataContext from "./userContext.js";

function UserContextProvider({ children }) {
  const serverUrl = "https://virtual-assistent-backend.onrender.com";
  const [userData, setUserData] = useState(null);
  const [frontEndImage, setFrontEndImage] = useState(null);
  const [backEndImage, setBackEndImage] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);

  const handleCurrentUser = async () => {
    try {
      const result = await axios.get(`${serverUrl}/current`, {
        withCredentials: true,
      });
      setUserData(result.data);
    } catch (error) {
      console.log(error);
    }
  };

  const getGeminiResponse = async (command) => {
    try {
      const result = await axios.post(
        `${serverUrl}/ask-to-assistant`,
        { command },
        { withCredentials: true }
      );
      if (!result?.data) {
        console.warn("No data received from assistant.");
        return { response: "No response from assistant." };
      }

      return result.data;
    } catch (error) {
      console.error(
        "getGeminiResponse error:",
        error?.response?.data || error.message
      );
      return {
        response: "Sorry, something wrong ! I am not able to understand.",
      };
    }
  };

  useEffect(() => {
    handleCurrentUser();
  }, []);

  const value = {
    serverUrl,
    userData,
    setUserData,
    frontEndImage,
    setFrontEndImage,
    backEndImage,
    setBackEndImage,
    selectedImage,
    setSelectedImage,
    getGeminiResponse,
  };

  return (
    <div>
      <UserDataContext.Provider value={value}>
        {children}
      </UserDataContext.Provider>
    </div>
  );
}

export default UserContextProvider;
