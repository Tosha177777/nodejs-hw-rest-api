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

// const multerStorage = multer.diskStorage({
//   destination: (req, file, cbk) => {
//     cbk(null, "public/avatars");
//   },
//   filename: (req, file, cbk) => {
//     const extension = file.mimetype.split("/")[1];

//     cbk(null, `${req.user._id}-${uuid()}.${extension}`);
//   },
// });

exports.uploadNewAvatar = ImageService.imageUploadMiddleware("avatar");
