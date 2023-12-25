const User = require("../models/usersSchema");
const { userService } = require("../srvice");
const { catchAsync } = require("../utils");

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
  const { email, subscription } = user;

  res.status(200).json({
    token,
    user: {
      email,
      subscription,
    },
  });
});

exports.logoutController = async (req, res) => {
  const { _id } = req.user;
  console.log("_id : ", _id);

  await User.findByIdAndUpdate(_id, { token: "" });

  res.status(204).json({ msg: "bye" });
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
