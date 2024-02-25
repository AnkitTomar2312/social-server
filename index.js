const express = require("express");
const Config = require("./config/config");
const userRoutes = require("./routes/user.routes");
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/", userRoutes);

app.listen(Config.PORT, () => {
  console.log(`Server is running on port ${Config.PORT}`);
});
