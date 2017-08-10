const express = require("express");
const mustacheExpress = require("mustache-express");
const bodyParser = require("body-parser");
const session = require("express-session");
const sessionConfig = require("./sessionConfig");
const app = express();


let users = [

  {
    username: "Chris",
    password: "5678"
  }
];
let currentUser = [];


app.engine("mustache", mustacheExpress());
app.set("views", "./views");
app.set("view engine", "mustache");


app.use("/", express.static("./views"));
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(session(sessionConfig));

function checkAuth(req, res, next) {
  if (!req.session.user) {
    return res.redirect("/login");
  } else {
    next();
  }
}


app.get("/", checkAuth, function(req, res) {
  res.render("index", {
    userListing: currentUser
  });
});

app.get("/login", function(req, res) {
  res.render("login");
});

app.post("/login", function(req, res) {
  if (!req.body || !req.body.username || !req.body.password) {
    return res.redirect("/login");
  }

  let requestingUser = req.body;
  let userDetails;
  users.forEach(function(item) {
    if (item.username === requestingUser.username) {
      userDetails = item;
      currentUser = item.username;
    }
  });

  if (!userDetails) {
    return res.redirect("/login");
  }

  if (requestingUser.password === userDetails.password) {
    req.session.user = userDetails;

    return res.redirect("/");
  } else {
    return res.redirect("/login");
  }
});


app.listen(3000);
