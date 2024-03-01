const express = require("express");
const userCtrl = require("../controllers/user.controller");
const router = express.Router();

router.route("/api/users/register").post(userCtrl.createUser);
router.route("/api/users").get(userCtrl.getallusers);
router.route("/api/users/:userid").get(userCtrl.getuser);
router.route("/api/users/:userid").put(userCtrl.updateuser);
router.route("/api/users/:userid").delete(userCtrl.deleteuser);

module.exports = router;
