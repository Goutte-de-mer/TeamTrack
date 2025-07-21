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

  const token = generateToken(newUser._id, newUser.userName, newUser.email);

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

  if (!user)
    return res.status(401).json({ error: "Email ou mot de passe incorrect" });

  const isValidPassword = await bcrypt.compare(password, user.password);

  if (!isValidPassword) {
    return res.status(401).json({ error: "Email ou mot de passe incorrect" });
    // throw new Error("Email ou mot de passe incorrect");
  }

  const token = generateToken(user._id, user.userName, user.email);

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
  // Récupère l'utilisateur actuel
  const currentUser = await User.findById(userId);
  if (!currentUser) throw new Error("Utilisateur non trouvé");

  // Ne garde que les champs modifiés
  const updates = {};
  if (userName !== undefined && userName !== currentUser.userName) {
    updates.userName = userName;
  }
  if (email !== undefined && email !== currentUser.email) {
    updates.email = email;
  }

  if (Object.keys(updates).length === 0) {
    return currentUser;
  }

  const updatedUser = await User.findByIdAndUpdate(
    userId,
    { $set: updates },
    { new: true, runValidators: true }
  );

  return updatedUser;
};
