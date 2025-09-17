import express from "express";
import "dotenv/config";
import connectToDb from "./config/db.config.js";

connectToDb();

const app = express();

const PORT = 8000;

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(PORT, () => {
  console.log("Server is listening to PORT 8000");
});
