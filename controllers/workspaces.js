const Workspace = require("../models/Workspace");
const Ticket = require("../models/Ticket");
const User = require("../models/User");
const shortid = require("shortid");
const jwt = require("jsonwebtoken");

const service = require("../services/workspaces");
require("dotenv").config();

module.exports.createWorkspace = async (req, res) => {
  try {
    const { name } = req.body;

    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    const user = jwt.decode(token);

    const candidate = await Workspace.findOne({ name: name });

    if (candidate) {
      return res
        .status(209)
        .json({ message: "Workspace with this name already exists" });
    }

    const newWorkspace = {
      name: name,
      id: shortid.generate(),
      owner: user.username,
      creationDate: new Date(),
      members: [user.username],
    };

    const workspace = new Workspace(newWorkspace);
    await workspace.save();

    await User.updateOne(
      { username: user.username },
      { $push: { workspaces: newWorkspace.id } }
    );

    res.status(201).json({
      message: "Workspace created successfully",
      data: workspace,
    });
  } catch (e) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

module.exports.getAllWorkspaces = async (req, res) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    const userData = jwt.decode(token);

    const user = await User.findOne({ username: userData.username });

    const workspaces = await Workspace.find({ id: { $in: user.workspaces } });

    if (workspaces.length === 0) {
      res.status(400).json({ message: "Workspaces not found" });
    }
    res.status(200).json({
      data: workspaces,
    });
  } catch (e) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

module.exports.getWorkspace = async (req, res) => {
  try {
    const { workspaceId } = req.params;
    const workspace = await Workspace.findOne({ id: workspaceId });
    if (!workspace) {
      return res.status(400).json({ message: "Workspace does not exist" });
    }

    for (let column of workspace.data) {
      const thisTickets = [];

      for (let ticket of column.tickets) {
        const thisTicket = await Ticket.findOne({ id: ticket });

        if (!thisTicket) return;
        thisTickets.push(thisTicket);
      }

      column.tickets = thisTickets;
    }

    res.status(200).json({
      data: workspace,
    });
  } catch (e) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

module.exports.addData = async (req, res) => {
  try {
    const { name, color } = req.body;
    const { workspaceId } = req.params;

    const candidate = await Workspace.findOne({ id: workspaceId });
    if (!candidate) {
      return res.status(400).json({ message: "Workspace does not exist" });
    }
    candidate.data.forEach((item) => {
      if (item.name === name) {
        return res
          .status(400)
          .json({ message: "Column with this name already exists" });
      }
    });

    const newData = {
      id: shortid.generate(),
      name: name,
      color: color,
    };
    await Workspace.updateOne(
      { id: workspaceId },
      { $push: { data: newData } }
    );

    const responseWorkspace = await Workspace.findOne({ id: workspaceId });
    res.status(201).json({
      message: "Column created successfully",
      data: responseWorkspace,
    });
  } catch (e) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

module.exports.deleteWorkspace = async (req, res) => {
  try {
    const { workspaceId } = req.params;
    const candidate = await Workspace.findOne({ id: workspaceId });
    if (!candidate) {
      return res.status(400).json({ message: "Workspace does not exist" });
    }

    await Workspace.deleteOne({ id: workspaceId });
    await User.updateMany(
      { workspaces: { $in: workspaceId } },
      {
        $pullAll: { workspaces: [workspaceId] },
      }
    );

    res.status(200).json({ message: "Workspace delete successfully" });
  } catch (e) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

module.exports.addMember = async (req, res) => {
  try {
    const { email, workspaceId } = req.body;

    const candidate = await User.findOne({ email: email });
    if (!candidate) {
      return res.status(400).json({ message: "User does not exist" });
    }
    service.sendInvitationEmail({
      email: candidate.email,
      workspaceId: workspaceId,
    });

    res.status(201).json({
      message: `An invitation email has been sent to ${candidate.username}`,
    });
  } catch (e) {
    res.status(500).json({ message: "Something went wrong" });
  }
};
module.exports.confirmMember = async (req, res) => {
  try {
    const { token } = req.body;

    const user = jwt.decode(token);

    const candidate = await User.findOne({ email: user.email });
    const workspaceCandidate = await Workspace.findOne({
      id: user.workspaceId,
    });

    if (!candidate) {
      return res.status(400).json({ message: "User does not exist" });
    }

    await User.updateOne(candidate, {
      $push: { workspaces: user.workspaceId },
    });
    await Workspace.updateOne(workspaceCandidate, {
      $push: { members: candidate.username },
    });

    res.status(200).json({
      message: `Invitation accepted successfully`,
    });
  } catch (e) {
    res.status(500).json({ message: "Something went wrong" });
  }
};
