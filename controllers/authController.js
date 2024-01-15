const User = require("../models/usersSchema");
const { userService, verifySender } = require("../srvice");
const { catchAsync, HttpError } = require("../utils");

exports.signupController = catchAsync(async (req, res) => {
  const { newUser, token } = await userService.signup(req.body);
  const { email, subscription, verificationToken } = newUser;

  await verifySender(req, verificationToken, email);

  res.status(201).json({
    token,
    user: {
      email,
      subscription,
    },
  });
});

exports.loginController = catchAsync(async (req, res) => {
  const { user, token } = await userService.login(req.body);
  // -----------

  // if user is not verified, throw new HttpErr

  if (!user.verify)
    throw new HttpError(
      400,
      "Not allowed to log in, please, verify your account"
    );
  // ---------
  const { email, subscription } = user;

  res.status(200).json({
    token,
    user: {
      email,
      subscription,
    },
  });
});

exports.verifyController = catchAsync(async (req, res) => {
  const { verificationToken } = req.user;

  await User.findOneAndUpdate(
    { verificationToken },
    { verificationToken: null, verify: true },
    { new: true }
  );

  res.status(200).json({
    message: "Verification successful",
  });
});

exports.sendVerifyToken = catchAsync(async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  const { verificationToken } = user;

  if (user.verify) {
    throw new HttpError(400, "Verification has already been passed");
  }

  await verifySender(req, verificationToken, email);

  res.status(200).json({
    message: "Verification email sent",
  });
});

exports.logoutController = async (req, res) => {
  const { _id } = req.user;

  if (!_id) {
    throw new HttpError(401, "Not authorized");
  }

  await User.findByIdAndUpdate(_id, { token: null });

  res.status(204).end();
};

exports.current = (req, res) => {
  const { email, subscription } = req.user;

  res.status(200).json({
    user: {
      email,
      subscription,
    },
  });
};

exports.updateAvatarController = catchAsync(async (req, res) => {
  const updatedUser = await userService.updateMe(req.body, req.user, req.file);

  res.status(200).json({
    avatarURL: updatedUser.avatarURL,
  });
});
