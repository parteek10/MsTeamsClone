const express = require("express");
const { logoutUser, registerUser, loginUser, verifyUser } = require("../controllers/users");
const auth = require("../middleware/auth");
const router = express.Router();
router.get("/user/verify", auth, verifyUser)
router.get("/logout", auth, logoutUser);

router.post("/user/signup", registerUser);

router.post("/user/signin", loginUser);

module.exports = router;