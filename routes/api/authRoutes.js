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

router.get(
  "/users/verify/:verificationToken",
  authMiddleware.checkUserVerify,
  authController.verifyController
);

router.post(
  "/users/verify",
  authMiddleware.checkUserMail,
  authController.sendVerifyToken
);

router.use(authMiddleware.protect);

router.post("/users/logout", authController.logoutController);

router.get("/users/current", authController.current);

router.patch(
  "/users/avatars",
  authMiddleware.uploadNewAvatar,
  authController.updateAvatarController
);

module.exports = router;
