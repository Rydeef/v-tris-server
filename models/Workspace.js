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
  owner: {
    type: String,
    required: true,
  },
  members: {
    type: [{ type: String }],
    
  },

  creationDate: {
    type: Date,
    required: true,
  },
  data: [
    {
      id: {
        type: String,
        required: true,
      },
      name: {
        type: String,
        required: true,
      },
      color: {
        type: String,
      },

      tickets: { type: Array },
    },
  ],
});

module.exports = model("workspaces", schema);
