// src/server.js
const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const routes = require("./routes/route");
const { get404 } = require("./controllers/404");
const path = require("path");
const session = require("express-session");
dotenv.config();

// Create Express app
const app = express();

// Body parser middleware
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.set("view engine", "ejs");
app.set("views", "views");
app.use(express.static(path.join(__dirname, "../content")));

app.use(
  session({
    secret: "your-secret-key", // Change this to your secret key
    resave: false,
    saveUninitialized: true,
  })
);
// MongoDB connection
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("MongoDB connected");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });

app.use("/", routes);
app.use(get404);
// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
