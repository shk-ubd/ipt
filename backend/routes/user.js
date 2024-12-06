import express from "express";
import Users from "../models/usermodel.js";
import bcrypt from "bcrypt";
import validator from "validator";

const UserRouter = express.Router();

// Register route
UserRouter.post("/register", async (req, res) => {
  const { email, password } = req.body;
  const salt = bcrypt.genSaltSync();

  try {
    // Validation
    if (!email || !password) {
      throw new Error("All fields must be filled");
    }
    if (!validator.isEmail(email)) {
      throw new Error("Email is not valid");
    }
    if (!validator.isStrongPassword(password)) {
      throw new Error(
        "Password is not strong enough. Password should contain uppercase, lowercase, special characters, and numbers (e.g., FGDsas12@)"
      );
    }

    const exist = await Users.findOne({ email });
    if (exist) {
      throw new Error("Email already in use");
    }

    const hashedPassword = bcrypt.hashSync(password, salt);
    const data = await Users.create({ email, password: hashedPassword });

    res.status(200).json({ email });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Login route
UserRouter.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      throw new Error("All fields must be filled");
    }

    const userExist = await Users.findOne({ email });
    if (!userExist) {
      throw new Error("Incorrect email");
    }

    const match = bcrypt.compareSync(password, userExist.password);
    if (!match) {
      throw new Error("Incorrect password");
    }

    res.status(200).json({ email });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

export default UserRouter;
