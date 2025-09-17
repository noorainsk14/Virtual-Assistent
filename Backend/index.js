import { app } from "./app.js";
import "dotenv/config";
import connectToDb from "./config/db.config.js";

connectToDb()
  .then(() => {
    app.listen(process.env.PORT || 8080, () => {
      console.log(`Server is running at port: ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.log("MongoDb connection failed !!", err);
  });
