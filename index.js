const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

const allowedOrigins = ["https://heye-frontend-wdfd.vercel.app", "http://localhost:5173"];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE"],
}));
app.use(express.json());

const mongoURI = process.env.MONGODB_URI;

mongoose
  .connect(mongoURI)
  .then(() => {
    console.log("Connected to MongoDB Atlas");
  })
  .catch((error) => {
    console.error("Connection error:", error.message);
  });

// Import routes
const employeeRouter = require("./routes/employee");
const attendanceRouter = require("./routes/attendance");
const leaveRouter = require("./routes/leave");

// Use routes
app.use("/employees", employeeRouter);
app.use("/attendance", attendanceRouter);
app.use("/leaves", leaveRouter);

app.get("/", (req, res) => {
  res.send("Welcome to the Office Management System API");
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send({ error: "Something went wrong!" });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
