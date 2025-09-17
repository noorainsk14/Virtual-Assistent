import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

export default async function connectToDb() {
  try {
    const connectionInstance = await mongoose.connect(MONGODB_URI);
    console.log(
      `\n MongoDB connected !! DB Host :${connectionInstance.connection.host}`
    );
  } catch (error) {
    console.log("MongoDb connection Error!", error);
    process.exit(1);
  }
}
