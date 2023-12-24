const { userService } = require("../srvice");
const { catchAsync, HttpError } = require("../utils");
const { signupUserValidator } = require("../utils/validator/validation");

exports.checkSignUpData = catchAsync(async (req, res, next) => {
  const { value, error } = signupUserValidator(req.body);

  if (error) throw new HttpError(400, "Invalid user data", error);

  await userService.checkUserExist({ email: value.email });

  req.body = value;

  next();
});
