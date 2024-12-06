import express from "express";
import WorkoutRouter from "./routes/workout.js";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import UserRouter from "./routes/user.js";

dotenv.config();

// Express app
const app = express();

// Middleware
app.use(express.json());
app.use(cors());
// Routes
app.use("/workout", WorkoutRouter);
app.use("/user", UserRouter);

// MongoDB connection URL
const url = process.env.MONGODB_URI;

// Listening for requests
app.listen(process.env.PORT, async () => {
  try {
    await mongoose.connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("Connected to MongoDB");
    console.log(`Listening on port ${process.env.PORT}`);
  } catch (error) {
    console.error("Error connecting to MongoDB:", error.message);
  }
});
