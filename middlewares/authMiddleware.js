// const User = require("../models/usersSchema");
const { userService, ImageService } = require("../srvice");
const { checkToken } = require("../srvice/jwtService");
const { getOneUser } = require("../srvice/userService");
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

exports.protect = catchAsync(async (req, res, next) => {
  const token =
    req.headers.authorization?.startsWith("Bearer ") &&
    req.headers.authorization.split(" ")[1];

  const userId = checkToken(token);

  if (!userId) throw new HttpError(401, "Not authorized");

  const currentUser = await getOneUser(userId);

  if (!currentUser || !currentUser.token)
    throw new HttpError(401, "Not authorized");

  req.user = currentUser;

  next();
});

// exports.checkUserVerify = catchAsync(async (req, res, next) => {
//   const currUser = await User.findOne({ verificationToken: req.params.verificationToken });
//   console.log("req.params: ", req.params);
//   console.log("currUser: ", currUser);

//   if (!currUser) throw new HttpError(404, "Not Found");
//   next();
// });

exports.uploadNewAvatar = ImageService.imageUploadMiddleware("avatar");
