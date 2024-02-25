const express = require("express");
const Config = require("./config/config");
const app = express();

app.get("/", (req, res) => {
  res.send("working");
});

app.listen(Config.PORT, () => {
  console.log(`Server is running on port ${Config.PORT}`);
});
