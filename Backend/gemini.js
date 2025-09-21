import axios from "axios";
const geminiResponse = async (command, assistantName, userName) => {
  try {
    const apiUrl = process.env.GEMINI_API_URL;
    const prompt = `You are a virtual assistant named ${assistantName} created by ${userName}. You are not Google. You will now behave like a voice-enabled assistant.
    
    Your task is to understand the user's natural language input and respond with a JSON object like this:
    {
    "type" : "general" | "google-search" | youtube-open | "youtube-search" | "youtube-play" | "get-time" | "get-date" | "get-day" | "get-month" | "weather-show" ,
    "userInput" : "<original user input>" {only remove your name from userinput if exist} and agar kisi ne google ya youtube pe kuch search krne bola hai to userInput me only wo search waala text jaye,
    "response" : "<a short spoken response to read out loud to the user>"
  }

  Instructions: 
  - "type" : determine the intent of the user.
  - "userinput" : original sentence the user spoke.
  - "response" : A short voice-friendly reply, e.g., "Sure, playing it now", "Here what I found", "Today is Tuesday", etc.

  Type meaning:
  - "general" : if it's a factual or informational question. aur agar koi aisa question puchta hai jiska answer tumhe pata h to usko bhi general category me rakho bas short me answer dena.
  - "google-search" : if user wants to search something on Google.
  - "google-open" : if user wants to open google on chrome.
  - "youtube-search" : if user wants to directly play a video or song.
  - "youtube-open" : if user wants to directly open a youtube.
  - "calculator-open" : if user wants to open a calculator.
  - "weather-show" : if user wants to see weather.
  - "instagram-open" : if user wants to open a instagram.
  - "facebook-search" : if user wants to open a facebook.
  - "get-time" : if user asks for current time.
  - "get-date" : if user asks for today's date.
  - "get-day" : if user asks for what day it is.
  - "get-month" : if user asks for current month.

  Important: 
  - Use "{author name}" agar koi puche tumhe kisne banaya
  - Only respond with JSON object, nothing else


    now your userInput - ${command}
    
  `;
    const result = await axios.post(apiUrl, {
      contents: [
        {
          parts: [
            {
              text: prompt,
            },
          ],
        },
      ],
    });

    return result.data.candidates[0].content.parts[0].text;
  } catch (error) {
    console.log(error);
  }
};

export default geminiResponse;
