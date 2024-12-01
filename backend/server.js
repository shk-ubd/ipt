const express = require("express");
const WorkoutRouter = require("./routes/workout");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const UserRouter = require("./routes/user");

dotenv.config();

//express app
const app = express();

app.use(cors({
  origin: "http://localhost:3000", // Replace with your frontend's URL
  credentials: true, // Allow cookies and other credentials
}));
console.log(process.env.JWT_SECRET);
//middleware
app.use(express.json());

//routes
app.use("/workout", WorkoutRouter);
app.use("/user", UserRouter);
//saname
//
//

//listening for request

const url = process.env.MONGODB_URI;

app.listen(process.env.PORT, async () => {
  try {
    await mongoose.connect(url);

    console.log("Connected to MongoDB");
    console.log("Listening on port 4000");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error.message);
  }
});
