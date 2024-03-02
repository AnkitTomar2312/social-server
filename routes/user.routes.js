const express = require("express");
const userCtrl = require("../controllers/user.controller");
const router = express.Router();
const authMiddleware = require("../middlewares/auth.middleware");
router.route("/api/users/register").post(userCtrl.createUser);
router.route("/api/users").get(userCtrl.getallusers);

router.put(
  "/api/users/follow",
  authMiddleware.verifyToken,
  userCtrl.addFollowing,
  userCtrl.addFollower
);

router.delete(
  "/api/users/follow",
  authMiddleware.verifyToken,
  userCtrl.removeFollowing,
  userCtrl.removeFollower
);

router
  .route("/api/users/:userid")
  .get(authMiddleware.verifyToken, userCtrl.getuser);
router
  .route("/api/users/:userid")
  .put(authMiddleware.verifyToken, userCtrl.updateuser);
router
  .route("/api/users/:userid")
  .delete(authMiddleware.verifyToken, userCtrl.deleteuser);

module.exports = router;
