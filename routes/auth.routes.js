const express = require("express");
const authCtrl = require("../controllers/auth.controller");
const router = express.Router();

router.post("/api/auth/login", authCtrl.login);
router.post("/api/auth/logout");

module.exports = router;
