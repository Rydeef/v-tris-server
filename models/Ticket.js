const {
    Schema,
    model
} = require("mongoose");

const ticketSchema = new Schema({
    ticketId: {
        type: String,
    },
    title: {
        type: String,
    },
    priority: {
        type: String,
    },
});

const schema = new Schema({
    title: {
        type: String,
        required: true,
    },
    columnId: {
        type: String,
        required: true,
    },
    owner: {
        type: String,
        required: true,
    },
    tickets: [ticketSchema],
    color: {
        type: String,
    },
});

module.exports = model("tickets", schema);