const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const Config = require("./config/config");
const userRoutes = require("./routes/user.routes");
const authRoutes = require("./routes/auth.routes");
const postRoutes = require("./routes/post.routes");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.use("/", userRoutes);
app.use("/", authRoutes);
app.use("/", postRoutes);

mongoose.set("strictQuery", false);
mongoose
  .connect(Config.mongoURI)
  .then(() => {
    console.log("Database Connected");
  })
  .catch((e) => {
    console.log(e);
  });

app.listen(Config.PORT, () => {
  console.log(`Server is running on port ${Config.PORT}`);
});
