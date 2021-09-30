const Workspace = require("../models/Workspace");
const User = require("../models/User");

const jwt = require("jsonwebtoken");

require("dotenv").config();

module.exports.getUserInfo = async (req, res) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader;
    const user = jwt.decode(token);

    const candidate = await User.findOne({ name: user.username });

    if (!candidate) {
      return res.status(209).json({ message: "User does not exists" });
    }

    candidate.workspaces = await Workspace.find({
      id: { $in: candidate.workspaces },
    });

    res.status(200).json({
      data: candidate,
    });
  } catch (e) {
    res.status(500).json({ message: "Something went wrong" });
  }
};
