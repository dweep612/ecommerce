require("dotenv").config();
const express = require("express");
const app = express();

app.get("/", (req, res) => {
  res.send("Server Testing");
});

const port = process.env.PORT || 8000;

app.listen(port, () => console.log(`Server Running at Port ${port}`));
