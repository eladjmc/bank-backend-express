import mongoose from 'mongoose';
import dotenv from "dotenv"
const connectDB = async () => {
  dotenv.config();
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log(`Mongo Connected: ${conn.connection.host}`.cyan.underline.bold);
  } catch (error) {
    console.log(`${error}`.red.bold);
  }
};

export default connectDB;