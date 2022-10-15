const express = require('express')
const mongoose = require('mongoose')
var cors= require('cors')

const userRoutes = require('./routes/users');
const videoRoutes = require("./routes/videos")

const commentRoutes = require("./routes/comments.js") ;
const authRoutes = require("./routes/auth.js");
const cookieParser = require( "cookie-parser");



const app = express();
app.use(cors())

const connect = () => {
  mongoose
    .connect("mongodb+srv://shubham:shubham@cluster0.jcu9o1y.mongodb.net/youtube?retryWrites=true&w=majority")
    .then(() => {
      console.log("Connected to DB");
    })
    .catch((err) => {
      throw err;
    });
};

//middlewares
app.use(cookieParser())
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/videos", videoRoutes);
app.use("/api/comments", commentRoutes);

//error handler
app.use((err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || "Something went wrong!";
  return res.status(status).json({
    success: false,
    status,
    message,
  });
});

app.listen(8800, () => {
  connect();
  console.log("Connected to Server");
});