const { model, Schema } = require("mongoose");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
// const { func } = require("joi");
const uuid = require("uuid").v4;

const userSchema = new Schema({
  password: {
    type: String,
    required: [true, "Set password for user"],
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
  },
  avatarURL: String,
  subscription: {
    type: String,
    enum: ["starter", "pro", "business"],
    default: "starter",
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: "user",
  },
  token: String,
  verify: {
    type: Boolean,
    default: false,
  },
  verificationToken: {
    type: String,
    required: [true, "Verify token is required"],
  },
});

userSchema.pre("save", async function (next) {
  if (this.isNew) {
    const emailHash = crypto.createHash("md5").update(this.email).digest("hex");

    this.avatarURL = `https://www.gravatar.com/avatar/${emailHash}.jpg?d=monsterid`;
  }

  if (!this.isModified("password")) return next();

  const salt = await bcrypt.genSalt(10);

  this.password = await bcrypt.hash(this.password, salt);

  next();
});

userSchema.methods.checkHash = (pass, hash) => bcrypt.compare(pass, hash);

userSchema.methods.generateVerifyToken = function () {
  const verToken = uuid();

  this.verificationToken = crypto
    .createHash("sha256")
    .update(verToken)
    .digest("hex");

  this.verify = true;

  return verToken;
};

const User = model("User", userSchema);

module.exports = User;
