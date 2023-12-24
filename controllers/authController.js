const { catchAsync } = require("../utils");
const { userService } = require("../srvice");

exports.signupController = catchAsync(async (req, res, next) => {
  const { user, token } = userService.signup(req.body);

  // const salt = await bcrypt.genSalt(10);
  // const passwordHash = await bcrypt.hash(user.password, salt);
  // console.log("passwordHash: ", passwordHash);

  res.status(201).json({
    user: {
      email: user.email,
      token,
    },
  });
});

exports.loginController = catchAsync(async (req, res, next) => {});
