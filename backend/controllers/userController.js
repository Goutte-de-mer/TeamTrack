const User = require("../db/models/User");
const bcrypt = require("bcrypt");
const { generateToken } = require("../utils/generateJwt");

exports.getAllUsers = async () => {
  return await User.find();
};

exports.registerUser = async ({ userName, email, password }) => {
  const plainPasswd = password;
  const hashedPasswd = await bcrypt.hash(plainPasswd, 12);

  const newUser = await User.create({
    userName,
    email,
    password: hashedPasswd,
  });

  const token = generateToken(newUser._id, newUser.userName);

  return {
    user: {
      _id: newUser._id,
      userName: newUser.userName,
      email: newUser.email,
    },
    token,
  };
};

exports.loginUser = async ({ email, password }) => {
  const user = await User.findOne({ email }).select("+password");

  if (!user) throw new Error("Identifiants invalides");

  const isValidPassword = await bcrypt.compare(password, user.password);

  if (!isValidPassword) {
    throw new Error("Email ou mot de passe incorrect");
  }

  const token = generateToken(user._id, user.userName);

  return {
    user: {
      _id: user.id,
      userName: user.userName,
      email: user.email,
    },
    token,
  };
};

exports.updateUser = async (userName, email, userId) => {
  const updates = {};
  if (userName !== undefined) updates.userName = userName;
  if (email !== undefined) updates.email = email;

  const updatedUser = await User.findByIdAndUpdate(
    userId,
    { $set: updates },
    { new: true, runValidators: true }
  );

  return updatedUser;
};
