const { signToken } = require("./jwtService");
const User = require("../models/usersSchema");
const { HttpError } = require("../utils");
const ImageService = require("./imageService");

exports.checkUserExist = async (data) => {
  const userExist = await User.exists(data);

  if (userExist) {
    throw new HttpError(409, "Email in use");
  }
};

exports.signup = async (data) => {
  const newUser = await User.create(data);

  // creating verify token

  const verificationToken = newUser.generateVerifyToken();

  newUser.password = undefined;

  const token = signToken(newUser.id);

  await User.findByIdAndUpdate(newUser.id, { token, verificationToken });

  return { newUser, token };
};

exports.login = async ({ email, password }) => {
  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    throw new HttpError(401, "Email or password is wrong");
  }

  const passIsValid = await user.checkHash(password, user.password);

  if (!passIsValid) {
    throw new HttpError(401, "Email or password is wrong");
  }

  user.password = undefined;

  const token = signToken(user.id);

  await User.findByIdAndUpdate(user.id, { token });

  return { user, token };
};

exports.getOneUser = (id) => User.findById(id);

exports.updateMe = async (userData, user, file) => {
  if (file) {
    user.avatarURL = await ImageService.saveImg(
      file,
      { maxFileSize: 2 },
      user.id
    );
  }

  Object.keys(userData).forEach((key) => {
    user[key] = userData[key];
  });

  return user.save();
};
