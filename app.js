const express = require("express");
const mongoose = require("mongoose");

require("dotenv").config();

const authRouter = require("./routes/auth");
const workspacesRouter = require("./routes/workspaces");
const ticketsRouter = require("./routes/tickets");
const userRouter = require("./routes/user");

const app = express();
app.use(require("cors")());

async function startServer() {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    app.listen(process.env.SERVER_PORT, () =>
      console.log(`App has been started on port ${process.env.SERVER_PORT}`)
    );
  } catch (e) {
    console.log("Server error", e.message);
    process.exit();
  }
}

app.use(express.json({ extended: true }));

app.use("/auth", authRouter);
app.use("/workspaces", workspacesRouter);
app.use("/tickets", ticketsRouter);
app.use("/user", userRouter);

startServer();
