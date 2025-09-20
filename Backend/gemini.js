import axios from "axios";
const geminiResponse = async (command, assistantName, userName) => {
  try {
    const apiUrl = process.env.GEMINI_API_URL;
    const prompt = `You are a virtual assistant named ${assistantName} created by ${userName}. You are not Google. You will now behave like a voice-enabled assistant.
    
    Your task is to understand the user's natural language input and respond with a JSON object like this:
    {
    "type" : "general" | "google_search" | "youtube_search" | "youtube_play" | "get_time" | "get_date" | "get_day" | "get_month" | "weather_show" ,
    "userinput" : "<original user input>" {only remove your name from userinput if exist} and agar kisi ne google ya youtube pe kuch search krne bola hai to userInput me only wo search waala text jaye,
    "response" : "<a short spoken response to read out loud to the user>"
  }

  Instructions: 
  - "type" : determine the intent of the user.
  - "userinput" : original sentence the user spoke.
  - "response" : A short voice-friendly reply, e.g., "Sure, playing it now", "Here what I found", "Today is Tuesday", etc.

  Type meaning:
  - "general" : if it's a factual or informational question.
  - "google_search" : if user wants to search something on Google.
  - "youtube_search" : if user wants to directly play a video or song.
  - "calculator_open" : if user wants to open a calculator.
  - "instagram_open" : if user wants to open a instagram.
  - "facebook_search" : if user wants to open a facebook.
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

    return result.data;
  } catch (error) {
    console.log(error);
  }
};

export default geminiResponse;
