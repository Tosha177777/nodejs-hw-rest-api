const express = require("express");

const { authMiddleware } = require("../../middlewares");
const { authController } = require("../../controllers");

const router = express.Router();

router.post(
  "/users/register",
  authMiddleware.checkSignUpData,
  authController.signupController
);

router.post(
  "/users/login",
  authMiddleware.checkLoginUserData,
  authController.loginController
);

router.post(
  "/users/logout",
  authMiddleware.protect,
  authController.logoutController
);

router.get("/users/current", authMiddleware.protect, authController.current);
module.exports = router;
