const express = require("express");
const Config = require("./config/config");
const userRoutes = require("./routes/user.routes");
const authRoutes = require("./routes/auth.routes");
const mongoose = require("mongoose");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/", userRoutes);
app.use("/", authRoutes);

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
