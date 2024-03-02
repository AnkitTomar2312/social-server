// const users = require("../data/users");
const userModel = require("../modles/user.model");
const bcrypt = require("bcrypt");
const createUser = async (req, res) => {
  const { name, email, password, about } = req.body;
  const user = new userModel({
    name,
    email,
    password: bcrypt.hashSync(password, 10),
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

const addFollowing = (req, res, next) => {
  userModel
    .findByIdAndUpdate(req.body.userid, {
      $push: { following: req.body.followId },
    })
    .then((data) => {
      if (!data) {
        res.status(404).send({ message: "User not found" });
      }
      next();
    })
    .catch((e) => {
      res.send({ message: e.message });
    });
};

// const addFollower = (req, res) => {
//   userModel
//     .findByIdAndUpdate(req.body.followId, {
//       $push: { followers: req.body.userid },
//     })
//     .then((data) => {
//       if (!data) {
//         res.status(404).send({ message: "User not found" });
//       }
//       res.status(200).send(data);
//     })
//     .catch((e) => {
//       res.send({ message: e.message });
//     });
// };

const addFollower = async (req, res) => {
  userModel
    .findByIdAndUpdate(
      req.body.followId,
      { $push: { followers: req.body.userid } },
      { new: true }
    )
    .populate("following", "name")
    .populate("followers", "name")
    .exec()
    .then((data) => {
      if (!data) {
        return res.status(404).send({ message: "User not found" });
      }
      res.status(200).send(data);
    })
    .catch((e) => {
      res.send({ message: e.message || "Could not retrieve the user" });
    });
};

const removeFollowing = (req, res, next) => {
  userModel
    .findByIdAndUpdate(req.body.userid, {
      $pull: { following: req.body.followId },
    })
    .then((data) => {
      if (!data) {
        res.status(404).send({ message: "User not found" });
      }
      next();
      // res.status(200).send({ message: "User unfollowed" });
    })
    .catch((e) => {
      res.send({ message: e.message });
    });
};

const removeFollower = async (req, res) => {
  userModel
    .findByIdAndUpdate(
      req.body.followId,
      { $pull: { followers: req.body.userid } },
      { new: true }
    )
    .then((data) => {
      if (!data) {
        return res.status(404).send({ message: "User not found" });
      }
      res.status(200).send(data);
    })
    .catch((e) => {
      res.send({ message: e.message || "Could not retrieve the user" });
    });
};

module.exports = {
  createUser,
  getallusers,
  getuser,
  updateuser,
  deleteuser,
  addFollowing,
  addFollower,
  removeFollowing,
  removeFollower,
};
