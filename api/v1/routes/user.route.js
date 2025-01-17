const express = require("express");
const router = express.Router();
const controller = require("../controller/user.controller");
const authMiddleware = require("../middlewares/auth.middleware");


router.post("/register", controller.register);
router.post("/login", controller.login);
router.post("/password/forgot", controller.forgotPassword);
router.post("/password/opt", controller.optPassword);
router.post("/password/reset-password", controller.resetPassword);
router.get("/detail",authMiddleware.requireAuth , controller.detail);
router.get("/list",authMiddleware.requireAuth , controller.list);




module.exports = router;