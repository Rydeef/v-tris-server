const { Schema, model } = require("mongoose");

const schema = new Schema({
  id: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["to do", "in progress", "review", "complete"],
    required: true,
  },
  priority: {
    type: String,
  },
  startDate: {
    type: Date,
  },
  endDate: {
    type: Date,
  },
  description: {
    type: String,
  },
  createdBy: {
    type: String,
  },
  creationDate: {
    type: Date,
    required: true,
  },
  members: {
    type: Array,
  },
  comments: [
    {
      text: {
        type: String,
        required: true,
      },
      date: {
        type: Date,
        required: true,
      },
      commentedBy: {
        type: String,
        required: true,
      },
    },
  ],
});

module.exports = model("tickets", schema);
