const Ticket = require("../models/Ticket");
const Workspace = require("../models/Workspace");
const shortid = require("shortid");

require("dotenv").config();

module.exports.addTicket = async (req, res) => {
  try {
    const ticketObj = req.body;

    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    const user = jwt.decode(token);

    const candidate = await Workspace.findOne({ id: workspaceId });
    if (!candidate) {
      return res.status(400).json({ message: "Workspace does not exist" });
    }

    ticketObj.id = shortid.generate();
    ticketObj.status = "to do";
    ticketObj.creationDate = new Date();
    ticketObj.createdBy = user.username;

    const ticket = new Ticket(ticketObj);
    await ticket.save();

    candidate.data.forEach((column) => {
      if (column.id === columnId) {
        column.tickets.push(ticketObj.id);
      }
    });

    await Workspace.updateOne({ id: workspaceId }, candidate);

    return res.status(201).json({ message: "Ticket created successfully" });
  } catch (e) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

module.exports.deleteTicket = async (req, res) => {
  try {
    const { ticketId, workspaceId } = req.params;
    const ticketCandidate = await Ticket.findOne({ id: ticketId });
    if (!ticketCandidate) {
      return res.status(400).json({ message: "Ticket does not exist" });
    }
    await Ticket.deleteOne({ id: ticketId });

    const workspaceCandidate = await Workspace.findOne({ id: workspaceId });
    workspaceCandidate.data.forEach((column) => {
      column.tickets.forEach((ticket, index) => {
        if (ticket === ticketId) {
          column.tickets.splice(index, 1);
        }
      });
    });
    await Workspace.updateOne({ id: workspaceId }, workspaceCandidate);

    res.status(200).json({ message: "Workspace delete successfully" });
  } catch (e) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

module.exports.editTicket = async (req, res) => {
  try {
    const { ticketId } = req.params;
    const ticketObj = req.body;

    const candidate = await Ticket.findOne({ id: ticketId });
    if (!candidate) {
      return res.status(400).json({ message: "Ticket does not exist" });
    }
    Ticket.updateOne({ id: ticketId }, ticketObj);
  } catch (e) {
    res.status(500).json({ message: "Something went wrong" });
  }
};
