require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const path = require("path");

const app = express();

// Routes
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const categoryRoutes = require("./routes/category");
const productRoutes = require("./routes/product");
const orderRoutes = require("./routes/order");
const stripeRoutes = require("./routes/stripepayment");
const braintreeRoutes = require("./routes/braintreepayment");

// DB Connection
mongoose
  .connect(
    `mongodb+srv://${process.env.DB_NAME}:${process.env.DB_PASS}@${process.env.DB_PROJECT}-xi8tq.mongodb.net/${process.env.DB_PROJECT}?retryWrites=true&w=majority`,
    {
      useNewUrlParser: true,
      useCreateIndex: true,
      useUnifiedTopology: true,
      useFindAndModify: true,
    }
  )
  .then(() => console.log("DB Connected!"))
  .catch(() => console.log("Failed to Connect DB"));

// Middleware
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors());

// My Routes
app.use("/api", authRoutes);
app.use("/api", userRoutes);
app.use("/api", categoryRoutes);
app.use("/api", productRoutes);
app.use("/api", orderRoutes);
app.use("/api", stripeRoutes);
app.use("/api", braintreeRoutes);

// app.use(express.static(path.join(__dirname, "client/build")));

// app.get("*", (req, res) => {
//   res.sendFile(path.join(__dirname + "/client/build/index.html"));
// });

const root = require("path").join(__dirname, "client", "build");

app.use(express.static(root));

app.get("*", (req, res) => {
  res.sendFile("index.html", { root });
});

// Server Connection
const port = process.env.PORT || 8000;

app.listen(port, () => console.log(`Server Running at Port ${port}`));
