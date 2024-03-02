const userModel = require("../modles/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const config = require("../config/config");
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
      let token = jwt.sign({ id: data._id }, config.secretkey);
      return res.send({
        user: {
          id: data._id,
          email: data.email,
          name: data.name,
        },
        accessToken: token,
      });
    })
    .catch((e) => {
      return res.send({ message: e.message });
    });
};

module.exports = { login };
