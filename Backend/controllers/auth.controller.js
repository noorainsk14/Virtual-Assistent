import genToken from "../config/token.js";
import User from "../models/User.model.js";
import bcrypt from "bcryptjs";

const signup = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(409).json({ message: "email already exist !" });
    }

    if (password.length < 6) {
      return res
        .status(409)
        .json({ message: "password must be atleast 6 character !" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      username,
      password: hashedPassword,
      email,
    });

    const createdUser = await User.findById(user._id)
      .select("-password")
      .lean();

    if (!createdUser) {
      return res
        .status(500)
        .json({ message: "Something went wrong while signUp the user" });
    }

    const token = await genToken(user._id);

    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: "strict",
      secure: false,
    });

    return res.status(201).json(createdUser);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: `signUp error ${error.message}` });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not exist !" });
    }

    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid) {
      return res.status(401).json({ message: "Invalid Password !" });
    }

    const loggedInUser = await User.findById(user._id)
      .select("-password")
      .lean();

    const token = await genToken(user._id);

    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: "strict",
      secure: false,
    });

    return res.status(200).json(loggedInUser);
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Something went wrong. Please try again." });
  }
};

const logout = async (req, res) => {
  try {
    res.clearCookie("token");
    return res.status(200).json({ message: "logout successfully !" });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: `Logout error ${error.message}` });
  }
};

export { signup, login, logout };
