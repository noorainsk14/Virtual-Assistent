import User from "../models/User.model.js";
import uploadOnCloudinary from "../config/cloudinary.js";
import geminiResponse from "../gemini.js";
import moment from "moment/moment.js";

export const getCurrentUser = async (req, res) => {
  try {
    const userId = req.userId;
    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(400).json({ message: "user not found" });
    }

    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({ message: "Get current user error !" });
  }
};

export const updateAssistant = async (req, res) => {
  try {
    const { assistantName, imageUrl } = req.body;
    let assistantImage;

    console.log("Received req.body:", req.body);
    console.log("Received req.file:", req.file);

    if (req.file) {
      assistantImage = await uploadOnCloudinary(req.file.path);
    } else {
      assistantImage = imageUrl;
    }
    console.log("UserID:", req.userId);
    console.log("Assistant image:", assistantImage);
    const user = await User.findByIdAndUpdate(
      req.userId,
      {
        assistantName,
        assistantImage,
      },
      { new: true }
    ).select("-password");

    res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({ message: "Update Assistant error !" });
  }
};

export const askToAssistant = async (req, res) => {
  try {
    const { command } = req.body;

    const user = await User.findById(req.userId);
    user.history.push(command);
    user.save();
    const userName = user.username;
    const assistantName = user.assistantName;
    const result = await geminiResponse(command, assistantName, userName);

    const jsonMatch = result.match(/{[\s\S]*}/);
    if (!jsonMatch) {
      return res.status(400).json({ response: "sorry, i can't understand" });
    }

    const gemResult = JSON.parse(jsonMatch[0]);

    const type = gemResult.type;

    switch (type) {
      case "get-date":
        return res.json({
          type,
          userInput: gemResult.userInput,
          response: `current date is ${moment().format("YYYY-MM-DD")}`,
        });
      case "get-time":
        return res.json({
          type,
          userInput: gemResult.userInput,
          response: `current time is ${moment().format("hh:mmA")}`,
        });

      case "get-day":
        return res.json({
          type,
          userInput: gemResult.userInput,
          response: `current day is ${moment().format("dddd")}`,
        });

      case "get-month":
        return res.json({
          type,
          userInput: gemResult.userInput,
          response: `current month is ${moment().format("MMMM")}`,
        });

      case "youtube-search":
      case "youtube-play":
      case "youtube-open":
      case "general":
      case "calculator-open":
      case "facebook-open":
      case "instagram-open":
      case "weather-show":
        return res.json({
          type,
          userInput: gemResult.userInput,
          response: gemResult.response,
        });

      default:
        return res
          .status(400)
          .json({ response: "I didn't understand that command." });
    }
  } catch (error) {
    return res.status(500).json({ response: "ask assistant error" });
  }
};
