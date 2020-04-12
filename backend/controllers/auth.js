const { check, validationResult } = require("express-validator");

var jwt = require("jsonwebtoken");
var expressJwt = require("express-jwt");

const User = require("../models/user");

exports.signup = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array()[0].msg });
  }

  const user = new User(req.body);

  user.save((err, user) => {
    if (err) {
      return res.status(400).json({
        error: "Unable to save user in DB",
      });
    }
    res.json({
      name: user.name,
      email: user.email,
      id: user._id,
    });
  });
};

exports.signin = (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({
      error: errors.array()[0].msg,
    });
  }

  const { email, password } = req.body;

  User.findOne({ email }, (err, user) => {
    if (err || !user) {
      return res.status(400).json({
        error: "User doesn't exist!",
      });
    }

    if (!user.authenticate(password)) {
      return res.status(401).json({
        error: "Email and password doesn't match",
      });
    }

    // Creating token
    const token = jwt.sign({ _id: user.id }, process.env.SECRET);

    // Put token in cookie
    res.cookie("token", token, { expire: new Date() + 9999 });

    // Send response to frontend
    const { _id, name, email, role } = user;
    return res.json({ token, user: { _id, name, email, role } });
  });
};

exports.signout = (req, res) => {
  res.clearCookie("token"); // app.use(cookieParser()) allow us to do this

  res.json({
    message: "User SignOut Successfully",
  });
};

// Protected Routes

exports.isSignedIn = expressJwt({
  secret: process.env.SECRET,
  userProperty: "auth",
});

// Custome Middlewares
exports.isAuthenticated = (req, res, next) => {
  let checker = req.profile && req.auth && req.profile._id == req.auth._id;

  if (!checker) {
    return res.status(403).json({
      error: "ACCESS DENIED",
    });
  }
  next();
};

exports.isAdmin = (req, res, next) => {
  if (req.profile.role === 0) {
    return res.status(403).json({
      error: "You are not admin",
    });
  }
  next();
};
