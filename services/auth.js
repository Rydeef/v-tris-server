const fs = require("fs");
const path = require("path");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

require("dotenv").config();

module.exports.generateAccessToken = (user) => {
  return jwt.sign(user, process.env.JWT_SECRET_CODE, { expiresIn: "24h" });
};

module.exports.sendConfirmationEmail = async (userObj) => {
  try {
    const mail = fs.readFileSync(
      path.join(__dirname, "../templates/confirmAccount.hbs"),
      "utf8"
    );

    const hash = jwt.sign(userObj, "secretKey", { expiresIn: "24h" });

    const newMail = () => {
      const repOne = mail.replace(
        "pageUrl",
        `http://localhost:3000/register/confirm`
      );
      return repOne.replace("token", `${hash}`);
    };

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_ADRESS,
        pass: process.env.EMAIL_PASS,
      },
    });
    await transporter.sendMail({
      from: process.env.EMAIL_ADRESS,
      to: userObj.email,
      subject: "Confirm account",
      text: "Confirm your V-Tris account.",
      html: newMail(),
    });
  } catch (err) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

module.exports.sendPasswordResetEmail = async (userObj) => {
  try {
    const mail = fs.readFileSync(
      path.join(__dirname, "../templates/info.hbs"),
      "utf8"
    );

    const hash = jwt.sign(userObj, "secretKey", { expiresIn: "2h" });

    const newMail = () => {
      const repOne = mail.replace(
        "pageUrl",
        `http://localhost:3000/login/reset`
      );
      repOne.replace(
        "messageInfo",
        `Click the button below to change your password`
      );
      return repOne.replace("token", `${hash}`);
    };

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_ADRESS,
        pass: process.env.EMAIL_PASS,
      },
    });
    await transporter.sendMail({
      from: process.env.EMAIL_ADRESS,
      to: userObj.email,
      subject: "Confirm account",
      text: "Confirm your V-Tris account.",
      html: newMail(),
    });
  } catch (err) {
    res.status(500).json({ message: "Something went wrong" });
  }
};
