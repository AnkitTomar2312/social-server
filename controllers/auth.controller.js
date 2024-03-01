const userModel = require("../modles/user.model");
const bcrypt = require("bcrypt");

const login = async (req, res) => {
  const { email, password } = req.body;
  userModel
    .findOne({ email: email })
    .then((data) => {
      if (!data) {
        return res.status(404).send({ message: "Email not found" });
      }
      let isPasswordValid = bcrypt.compareSync(password, data.password);
      if (!isPasswordValid) {
        return res.status(404).send({ message: "password not valid" });
      }
      return res.status(200).send({ message: "Logged in succesfully" });
    })
    .catch((e) => {
      return res.send({ message: e.message });
    });
};

module.exports = { login };
