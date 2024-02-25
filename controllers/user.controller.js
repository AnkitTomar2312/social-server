const users = require("../data/users");
const createUser = async (req, res) => {
  const user = users.some((element) => {
    if (req.body.email === element.email) {
      return element;
    }
  });
  if (user) {
    res.status(400).send({ message: "User Already Existed" });
    return;
  }
  users.push(req.body);
  res.send({ message: "user registered succesfully" });
};

const getallusers = async (req, res) => {
  res.send(users);
};

const getuser = async (req, res) => {
  const user = users.some((element) => {
    if (element.email === req.params.userid) {
      return res.send(element);
    } else {
      res.send({ message: "User not found" });
    }
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
