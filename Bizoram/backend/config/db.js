import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    const uri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/bizwoke_review";
    const conn = await mongoose.connect(uri);
    console.log(`[Database] MongoDB Connected: ${conn.connection.host}/${conn.connection.name}`);
    return conn;
  } catch (error) {
    console.error(`\n❌ [Database Error] Could not connect to MongoDB: ${error.message}`);
    console.error(`👉 Tip: Set your MongoDB Atlas connection string (or start MongoDB locally) in backend/.env:`);
    console.error(`   MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/bizwoke_review?retryWrites=true&w=majority\n`);
    process.exit(1);
  }
};
