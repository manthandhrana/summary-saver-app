const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

exports.register = async (req, res) => {
  const { email, password } = req.body;
  const hash = await bcrypt.hash(password, 10);
  await User.create({ email, password: hash });
  res.status(201).json({ message: "User registered" });
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.sendStatus(401);

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) return res.sendStatus(401);

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
  res
    .cookie("token", token, {  secure: true, sameSite: "None" })
    .json({ message: "Login successful" });
};

exports.logout = (req, res) => {
  res.clearCookie("token").json({ message: "Logged out" });
};
