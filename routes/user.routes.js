const express = require("express");
const userCtrl = require("../controllers/user.controller");
const router = express.Router();
const authMiddleware = require("../middlewares/auth.middleware");

router.route("/api/users/register").post(userCtrl.createUser);

router.route("/api/users").get(userCtrl.getallusers);

router.get("/api/users/photo/:userId");
router.get("/api/photo/defaultphoto");

// router.route('/api/users/photo/:userId')
//   .get(userCtrl.photo, userCtrl.defaultPhoto)
// router.route('/api/users/defaultphoto')
//   .get(userCtrl.defaultPhoto)

router.put(
  "/api/users/follow",
  authMiddleware.verifyToken,
  userCtrl.addFollowing,
  userCtrl.addFollower
);

router.put(
  "/api/users/unfollow",
  authMiddleware.verifyToken,
  userCtrl.removeFollowing,
  userCtrl.removeFollower
);

router
  .route("/api/users/findpeople/:userId")
  .get(authMiddleware.verifyToken, userCtrl.findPeople);

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
