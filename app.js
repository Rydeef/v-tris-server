const express = require("express");
const mongoose = require("mongoose");

require("dotenv").config();

const authRouter = require("./routes/auth");
const userRouter = require("./routes/user");
const ticketRouter = require("./routes/ticket");


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

app.use(express.json({
  extended: true
}));

app.use("/auth", authRouter);
app.use("/user", userRouter);
app.use("/tickets", ticketRouter);


startServer();