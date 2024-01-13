const User = require("../models/usersSchema");
const { userService } = require("../srvice");
const { catchAsync, HttpError } = require("../utils");

exports.signupController = catchAsync(async (req, res) => {
  const { newUser, token } = await userService.signup(req.body);
  const { email, subscription } = newUser;

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

exports.validationController = catchAsync(async (req, res) => {
  res.status(200).json({
    message: "Verification successful",
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
