const express = require("express");
const Users = require("../models/usermodel");
const bcrypt = require("bcrypt");
const validator = require("validator");
const jwt = require("jsonwebtoken");

const router = express.Router();

//token
const secret = process.env.JWT_SECRET;

const createToekn = (_id) => {
  return jwt.sign({ _id }, secret, { expiresIn: "2d" });
};

//register
router.post("/register", async (req, res) => {
  const { email, password } = req.body;
  const salt = bcrypt.genSaltSync();
  try {
    //validation
    if (!email || !password) {
      throw Error("All feilds must be filled");
    }
    if (!validator.isEmail(email)) {
      throw Error("Email is not valid");
    }
    if (!validator.isStrongPassword(password)) {
      throw Error(
        "Password is not strong enough. Password should contain uppercase,lowercase,spacial character and number (FGDsas12@) "
      );
    }

    const exist = await Users.findOne({ email });
    if (exist) {
      throw Error("Email already in use");
    }
    const data = await Users.create({
      email,
      password: bcrypt.hashSync(password, salt),
    });
    const token = createToekn(data._id);
    res.status(200).json({ email, token });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

//login

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      throw Error("All fields must be filled");
    }
    const userexist = await Users.findOne({ email });
    if (!userexist) {
      throw Error("Incorrect enail");
    }
    const match = bcrypt.compareSync(password, userexist.password);
    if (!match) {
      throw Error("Incorrect Password");
    }

    //token

    const token = createToekn(userexist._id);
    res.status(200).json({ email, token });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
