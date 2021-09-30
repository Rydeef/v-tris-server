const fs = require("fs");
const path = require("path");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

require("dotenv").config();

module.exports.sendInvitationEmail = async (workspace) => {
  try {
    const mail = fs.readFileSync(
      path.join(__dirname, "../templates/info.hbs"),
      "utf8"
    );

    const hash = jwt.sign(workspace, "secretKey", { expiresIn: "24h" });

    const newMail = () => {
      const repOne = mail.replace(
        "pageUrl",
        `http://localhost:3000/workspaces/invitation`
      );
      repOne.replace(
        "messageInfo",
        `Click the button below to accept invitation`
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
      to: workspace.email,
      subject: "Workspace invitaion.",
      text: "Workspace invitaion.",
      html: newMail(),
    });
  } catch (err) {
    res.status(500).json({ message: "Something went wrong" });
  }
};
