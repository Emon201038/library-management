import mongoose from "mongoose";
import { DB_URL as dbUrl } from "../../secret";


const connectDb = async () => {
  try {
    mongoose.connect(dbUrl).then(() => {
      console.log("Connected to DB is successful");
    });
    mongoose.connection.on("error", (err) => {
      console.error("DB connection error", err);
    });
  } catch (error) {
    console.error('error:', error);
  }
};

export default connectDb