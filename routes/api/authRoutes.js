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

module.exports = router;
