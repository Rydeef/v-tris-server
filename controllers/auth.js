const bcrypt = require("bcryptjs");
const { validationResult } = require("express-validator");
const User = require("../models/User");
const service = require("../services/auth");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const path = require("path");

require("dotenv").config();

module.exports.register = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: "Invalid registation fields",
      });
    }

    const { userName, email, password, confirmPassword } = req.body;

    const candidateEmail = await User.findOne({ email: email });
    const candidateUsername = await User.findOne({ email: email });

    if (candidateEmail) {
      return res
        .status(400)
        .json({ message: "User with this email already exists" });
    }
    if (candidateUsername) {
      return res
        .status(400)
        .json({ message: "User with this name already exists" });
    }

    if (String(password) !== String(confirmPassword)) {
      return res.status(400).json({ message: "Password mismatch" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const userObj = {
      username: userName,
      email,
      password: hashedPassword,
      confirmed: false,
    };
    const user = new User(userObj);

    service.sendConfirmationEmail(userObj);

    await user.save();

    res.status(201).json({
      message: "A confirmation email has been sent to your email",
    });
  } catch (e) {
    res.status(500).json({ message: "Something went wrong" });
  }
};
module.exports.registerConfirmation = async (req, res) => {
  try {
    const { token } = req.params;
    const user = jwt.decode(token);

    const candidate = await User.findOne({ email: user.email });

    const infoPage = fs.readFileSync(
      path.join(__dirname, "../templates/info.hbs"),
      "utf8"
    );

    if (!candidate) {
      return res.send(infoPage.replace("messageInfo", "User does not exist"));
    }
    if (candidate.confirmed) {
      return res.send(
        infoPage.replace("messageInfo", "User already confirmed")
      );
    }

    await User.updateOne({ email: user.email }, { confirmed: true });

    return res.send(
      infoPage.replace("messageInfo", "User confirmed successfully")
    );
  } catch (e) {
    res.status(500).json({ message: "Something went wrong" });
  }
};
