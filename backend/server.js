require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const corsURL = process.env.CORS_URL

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: corsURL, credentials: true }));

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error(err));

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/bookmarks", require("./routes/bookmarkRoutes"));
app.get("/", (res,res)=>{
  res.statusCode(200).send("Welcome to Summary Saver App")
});

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
