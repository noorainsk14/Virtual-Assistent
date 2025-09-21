import React, { useState, useContext, useEffect, useRef } from "react";
import UserDataContext from "../../context/userContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ai from "../../assets/ai.gif";
import userImg from "../../assets/user.gif";
import { CgMenuRight } from "react-icons/cg";
import { ImCross } from "react-icons/im";

const Home = () => {
  const { userData, serverUrl, setUserData, getGeminiResponse } =
    useContext(UserDataContext);
  const navigate = useNavigate();

  const [listening, setListening] = useState(false);
  const [userText, setUserText] = useState("");
  const [aiText, setAiText] = useState("");
  const recognitionRef = useRef(null);
  const isSpeakingRef = useRef(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [ham, setHam] = useState(false);
  const isRecognizingRef = useRef(false);

  const synth = window.speechSynthesis;

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

  const startRecognition = () => {
    // ✅ Avoid starting if already recognizing
    if (isRecognizingRef.current || isSpeakingRef.current) return;

    try {
      recognitionRef.current?.start();
      isRecognizingRef.current = true;
      setListening(true);
    } catch (error) {
      if (error.name !== "InvalidStateError") {
        console.error("Recognition start error:", error);
      }
    }
  };

  const speak = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    isSpeakingRef.current = true;
    setIsSpeaking(true);

    utterance.onend = () => {
      isSpeakingRef.current = false;
      setIsSpeaking(false);
      setAiText("");
      isSpeakingRef.current = false;
      setTimeout(() => {
        startRecognition();
      }, 800);
    };
    synth.cancel();

    synth.speak(utterance);
  };

  const handleCommand = (data) => {
    const { type, userInput, response } = data;
    speak(response);

    if (type === "google-search") {
      const query = encodeURIComponent(userInput);
      window.open(`https://www.google.com/search?q=${query}`, "_blank");
    }

    if (type === "calculator-open") {
      window.open(`https://www.google.com/search?q=calculator`, "_blank");
    }

    if (type === "google-open") {
      window.open(`https://www.google.com/search?q=calculator`, "_blank");
    }
    if (type === "weather-show") {
      window.open(`https://www.google.com/search?q=weather`, "_blank");
    }

    if (type === "instagram-open") {
      window.open(`https://www.instagram.com`, "_blank");
    }
    if (type === "facebook-open") {
      window.open(`https://www.facebook.com`, "_blank");
    }
    if (type === "youtube-open") {
      window.open(`https://www.youtube.com`, "_blank");
    }

    if (type === "youtube-search" || type === "youtube-play") {
      const query = encodeURIComponent(userInput);
      window.open(
        `https://www.youtube.com/results?search_query=${query}`,
        "_blank"
      );
    }
  };

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.lang = "en-US";
    recognition.interimResults = false;

    recognitionRef.current = recognition;

    let isMounted = true; //flag to avoid setState on unmounted

    //start recognition after 1 second delay if componenet still mounted

    const startTimeout = setTimeout(() => {
      if (
        isMounted &&
        !isSpeakingRef.current &&
        !isRecognizingRef.current &&
        userData?.assistantName
      ) {
        try {
          recognition.start();
        } catch (e) {
          if (e.name !== "InvalidStateError") {
            console.error(e);
          }
        }
      }
    }, 1000);

    recognition.onstart = () => {
      isRecognizingRef.current = true;
      setListening(true);
    };

    recognition.onend = () => {
      isRecognizingRef.current = false;
      setListening(false);
      if (isMounted && !isSpeakingRef.current) {
        setTimeout(() => {
          if (isMounted) {
            try {
              recognition.start();
            } catch (e) {
              if (e.name !== "InvalidStateError") {
                console.error(e);
              }
            }
          }
        }, 1000);
      }
    };

    recognition.onerror = (event) => {
      console.warn("Recognition error:", event.error);
      isRecognizingRef.current = false;
      setListening(false);

      if (event.error !== "aborted" && !isSpeakingRef.current) {
        setTimeout(() => {
          if (isMounted) {
            try {
              recognition.start();
            } catch (e) {
              if (e.name !== "InvalidStateError") {
                console.log(e);
              }
            }
          }
        });
      }
    };

    recognition.onresult = async (e) => {
      const transcript = e.results[e.results.length - 1][0].transcript.trim();

      // ✅ Check if assistantName is available
      if (!userData?.assistantName) {
        console.warn(
          "Assistant name is not available yet. Skipping transcript."
        );
        return;
      }

      if (
        transcript.toLowerCase().includes(userData.assistantName.toLowerCase())
      ) {
        setAiText("");
        setUserText(transcript);
        setAiText("");
        recognition.stop();
        isRecognizingRef.current = false;
        setListening(false);

        const data = await getGeminiResponse(transcript);
        handleCommand(data);
        setAiText(data.response);
        setUserText("");
      }
    };

    const greeting = new SpeechSynthesisUtterance(
      `Hello ${userData.username}, what can I help you with`
    );
    greeting.lang = "en-US";
    window.speechSynthesis.speak(greeting);

    return () => {
      isMounted = false;
      clearTimeout(startTimeout);
      recognition.stop();
      setListening(false);
      isRecognizingRef.current = false;
    };
  }, [userData]);

  return (
    <div className="w-full h-[100vh] bg-gradient-to-t from-[black] to-[#02023d] flex justify-center items-center flex-col gap-[15px] overflow-hidden">
      <CgMenuRight
        className="lg:hidden text-white absolute top-[20px] right-[20px] w-[30px] h-[30px]"
        onClick={() => setHam(true)}
      />
      <div
        className={`absolute lg:hidden top-0 w-full h-[100%] x bg-[#00000053] backdrop-blur-lg p-[20px] flex flex-col gap-[10px] items-start ${
          ham ? "translate-x-0" : "translate-x-full"
        } transition-transform`}
      >
        <ImCross
          className=" text-white absolute top-[20px] right-[20px] w-[30px] h-[30px]"
          onClick={() => setHam(false)}
        />
        <button
          className="min-w-[130px] h-[60px] mt-[10px] text-black font-semibold top-[30px] right-[20px] bg-white rounded-full cursor-pointer text-[19px]"
          onClick={handleLogOut}
        >
          Log Out
        </button>
        <button
          className="min-w-[130px] h-[50px] mt-[10px] text-black font-semibold bg-white  top-[100px] right-[20px] cursor-pointer rounded-full text-[19px] px-[20px] py-[10px]"
          onClick={() => {
            navigate("/customize");
          }}
        >
          Customize
        </button>

        <div className="w-full h-[2px] bg-gray-400">
          <h1 className="text-white text-[19px] font-semibold mt-4">History</h1>
        </div>
        <div className="w-full h-full overflow-y-auto mt-10 mb-10 rounded-lg backdrop-blur-sm bg-white/5 px-4 py-3">
          <div className="flex flex-col gap-2">
            {userData?.history && userData.history.length > 0 ? (
              userData.history.map((his, index) => (
                <span
                  key={index}
                  className="text-white text-[15px] truncate hover:whitespace-normal transition-all duration-200"
                >
                  {his}
                </span>
              ))
            ) : (
              <span className="text-gray-400">No history found.</span>
            )}
          </div>
        </div>
      </div>
      <button
        className="min-w-[150px] h-[60px] mt-[30px] text-black font-semibold absolute hidden lg:block top-[20px] right-[20px] bg-white rounded-full cursor-pointer text-[19px]"
        onClick={handleLogOut}
      >
        Log Out
      </button>
      <button
        className="min-w-[150px] h-[60px] mt-[30px] text-black font-semibold bg-white absolute hidden lg:block top-[100px] right-[20px] cursor-pointer rounded-full text-[19px] px-[20px] py-[10px]"
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

      {!isSpeaking ? (
        <img src={userImg} alt="userGIF" className="w-[200px]" />
      ) : (
        <img src={ai} alt="aiGIF" className="w-[200px]" />
      )}

      <h1 className="text-white text-[18px] font-semibold text-wrap">
        {userText ? userText : aiText ? aiText : null}
      </h1>
    </div>
  );
};

export default Home;
