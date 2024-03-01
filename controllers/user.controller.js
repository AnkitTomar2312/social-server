// const users = require("../data/users");
const userModel = require("../modles/user.model");
const createUser = async (req, res) => {
  const { name, email, password, about } = req.body;
  const user = new userModel({
    name,
    email,
    password,
    about,
  });
  user
    .save()
    .then((data) => {
      if (!data) {
        res.status(400).send({ message: "User not created" });
      }
      res.status(200).send({ message: "user registered successfully" });
    })
    .catch((e) => {
      res.send({ message: e.message || "Some Error occured" });
    });
};

const getallusers = async (req, res) => {
  userModel
    .find()
    .select("name email updated created")
    .then((data) => {
      if (!data) {
        res.status(400).send({ message: "No users" });
      }
      res.status(200).send(data);
    });
};

const getuser = async (req, res) => {
  const id = req.params.userid;
  userModel
    .findById(id)
    .then((data) => {
      if (!data) {
        res.status(404).send({ message: "user not found" });
      }
      res.status(200).send(data);
    })
    .catch((e) => {
      res.send({ message: e.message });
    });
};

const updateuser = async (req, res) => {
  const index = users.findIndex((element) => {
    return element.email === req.params.userid;
  });
  if (index === -1) {
    res.send({ message: "User not found" });
  } else {
    req.body.name ? (users[index].name = req.body.name) : "";
    req.body.email ? (users[index].email = req.body.email) : "";
    req.body.passwrod ? (users[index].passwrod = req.body.passwrod) : "";
  }
  res.send({ message: "Profile updated" });
};

const deleteuser = (req, res) => {
  const index = users.findIndex((user) => {
    return user.email === req.params.userid;
  });
  if (index === -1) {
    res.send({ message: "User not found" });
    return;
  } else {
    users.splice(index, 1);
    res.send({ message: "User deleted" });
    return;
  }
};
module.exports = { createUser, getallusers, getuser, updateuser, deleteuser };
