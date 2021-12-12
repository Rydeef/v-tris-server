const Ticket = require("../models/Ticket");
const {
    v4: uuidv4
} = require('uuid');
const jwt = require("jsonwebtoken");

require("dotenv").config();

module.exports.getTickets = async (req, res) => {
    try {
        const authHeader = req.headers["authorization"];

        const token = authHeader.split(' ')[1];
        const user = jwt.decode(token);
        const tickets = await Ticket.find({
            owner: user.username
        });

        if (!tickets.length) {
            return res.status(209).json({
                message: "No tickets"
            });
        }

        return res.status(200).json({
            data: tickets,
        });
    } catch (e) {
        return res.status(500).json({
            message: "Something went wrong"
        });
    }
};

module.exports.createColumn = async (req, res) => {
    try {
        const authHeader = req.headers["authorization"];
        const token = authHeader.split(' ')[1];
        const user = jwt.decode(token);
        const {
            title,
            color,
        } = req.body;
        let columnColor = '#ffffff'

        if (color) {
            columnColor = color
        }
        if (!title) {
            return res.status(400).json({
                message: "Missing fields"
            });
        }

        const columnObj = {
            title,
            owner: user.username,
            columnId: uuidv4(),
            tickets: [],
            color: columnColor,
        }

        const column = new Ticket(columnObj);

        await column.save();

        const collection = await Ticket.find({
            owner: user.username
        })

        return res.status(200).json({
            data: collection
        });

    } catch (e) {
        return res.status(500).json({
            message: "Something went wrong"
        });
    }
}

module.exports.createTicket = async (req, res) => {
    try {
        const authHeader = req.headers["authorization"];
        const token = authHeader.split(' ')[1];
        const user = jwt.decode(token);

        const {
            title,
            columnId,
            priority
        } = req.body;

        let ticketPriority = 'low'

        if (priority) {
            ticketPriority = priority
        }

        if (!title) {
            return res.status(400).json({
                message: "Missing fields"
            });
        }

        if (!columnId) {
            return res.status(400).json({
                message: "Missing column id"
            });
        }

        const ticketObj = {
            title,
            ticketId: uuidv4(),
            priority: ticketPriority
        }

        await Ticket.updateOne({
            columnId: columnId
        }, {
            $push: {
                tickets: ticketObj
            }
        });

        const collection = await Ticket.find({
            owner: user.username
        })

        return res.status(200).json({
            data: collection
        });

    } catch (e) {
        return res.status(500).json({
            message: "Something went wrong"
        });
    }
}

module.exports.deleteColumn = async (req, res) => {
    try {
        const authHeader = req.headers["authorization"];
        const token = authHeader.split(' ')[1];
        const user = jwt.decode(token);

        const {
            columnId,
        } = req.params;

        if (!columnId) {
            return res.status(400).json({
                message: "Missing column id"
            });
        }

        await Ticket.findOneAndRemove({
            columnId: columnId
        });

        const collection = await Ticket.find({
            owner: user.username
        })

        return res.status(200).json({
            data: collection
        });

    } catch (e) {
        return res.status(500).json({
            message: "Something went wrong"
        });
    }
}

module.exports.deleteTicket = async (req, res) => {
    try {
        const authHeader = req.headers["authorization"];
        const token = authHeader.split(' ')[1];
        const user = jwt.decode(token);

        const {
            columnId,
            ticketId
        } = req.params;

        if (!columnId) {
            return res.status(400).json({
                message: "Missing column id"
            });
        }

        if (!ticketId) {
            return res.status(400).json({
                message: "Missing ticket id"
            });
        }

        const columnCandidate = await Ticket.findOne({
            columnId: columnId
        })

        if (!columnCandidate) {
            return res.status(400).json({
                message: "This column does not exists"
            });
        }

        if (!columnCandidate.tickets.find((el) => el.ticketId === ticketId)) {
            return res.status(400).json({
                message: "This ticket does not exists"
            });
        }

        await Ticket.updateOne({
            columnId: columnId
        }, {
            $pull: {
                tickets: {
                    ticketId: ticketId
                }
            }
        });

        const collection = await Ticket.find({
            owner: user.username
        })

        return res.status(200).json({
            data: collection
        });

    } catch (e) {
        return res.status(500).json({
            message: "Something went wrong"
        });
    }
}