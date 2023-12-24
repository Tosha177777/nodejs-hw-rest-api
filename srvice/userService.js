const bcrypt = require("bcrypt");

const { signToken } = require("./jwtService");
const User = require("../models/usersSchema");
const { HttpError } = require("../utils");

exports.checkUserExist = async (data) => {
  const userExist = await User.exists(data);

  if (userExist) {
    throw new HttpError(409, "Email in use");
  }
};

exports.signup = async (data) => {
  const newUser = await User.create(data);

  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(newUser.password, salt);

  newUser.password = passwordHash;
  console.log("newUser.password: ", newUser.password);

  const token = signToken(newUser.id);

  return { user: newUser, token };
};
