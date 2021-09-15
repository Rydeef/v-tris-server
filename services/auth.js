const fs = require("fs");
const path = require("path");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

require("dotenv").config();

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
      subject: "Message from Node js",
      text: "This message was sent from Node js server.",
      html: newMail(),
    });
  } catch (err) {
    res.status(500).json({ message: "Something went wrong" });
  }
};
