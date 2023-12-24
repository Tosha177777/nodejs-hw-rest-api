const express = require("express");

const { authMiddleware } = require("../../middlewares");
const { authController } = require("../../controllers");

const router = express.Router();

router.post(
  "/users/register",
  authMiddleware.checkSignUpData,
  authController.signupController
);

// router.post("/users/login", authController.login);

// router.post("/users/login");

module.exports = router;
