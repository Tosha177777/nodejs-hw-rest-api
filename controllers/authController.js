const { userService } = require("../srvice");
const { catchAsync } = require("../utils");

exports.signupController = catchAsync(async (req, res) => {
  const { newUser } = await userService.signup(req.body);
  const { email, subscription } = newUser;

  res.status(201).json({
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
