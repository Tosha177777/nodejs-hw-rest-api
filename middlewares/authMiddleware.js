const { userService } = require("../srvice");
const { catchAsync, HttpError } = require("../utils");
const { validator } = require("../utils/validator");

exports.checkSignUpData = catchAsync(async (req, res, next) => {
  const { value, error } = validator.signupUserValidator(req.body);

  if (error) throw new HttpError(400, "Invalid user data", error);

  await userService.checkUserExist({ email: value.email });

  req.body = value;

  next();
});

exports.checkLoginUserData = (req, res, next) => {
  const { value, error } = validator.loginValidator(req.body);

  if (error) throw new HttpError(400, "Bad Request", error);

  req.body = value;

  next();
};
