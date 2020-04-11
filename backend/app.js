require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");

const app = express();

// DB Connection
mongoose
  .connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("DB Connected!"))
  .catch(() => console.log("Failed to Connect DB"));

app.get("/", (req, res) => {
  res.send("Server Testing");
});

// Server Connection
const port = process.env.PORT || 8000;

app.listen(port, () => console.log(`Server Running at Port ${port}`));
