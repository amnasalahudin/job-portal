const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../Models/User");

const registerUser = async (req, res) => {
  try {
    const { name, email, password, contact, role } = req.body;
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res
        .status(400)
        .send({ error: "User with this email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 8);
    const user = new User({
      name,
      email,
      password: hashedPassword,
      contact,
      role,
    });
    await user.save();

    res.status(201).json({ message: "User created successfully" });
  } catch (e) {
    res.status(500).send(e);
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).send({ error: "Invalid email or password" });
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordMatch) {
      return res.status(401).send({ error: "Invalid email or password" });
    }

    const token = jwt.sign({ _id: user._id }, "secret");

    console.log(token);
    res.send({ user, token });
  } catch (e) {
    res.status(500).send(e);
  }
};

const editUser = async (req, res) => {
  try {
    const { name, email, password, contact, role } = req.body;
    const { userId } = req.params;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).send({ error: "User not found" });
    }

    // If user is changing email, check if new email already exists in database
    if (email && email !== user.email) {
      const emailExists = await User.findOne({ email });
      if (emailExists) {
        return res.status(400).send({ error: "Email already exists" });
      }
    }

    // Hash new password if provided
    let hashedPassword = user.password;
    if (password) {
      hashedPassword = await bcrypt.hash(password, 8);
    }

    user.name = name || user.name;
    user.email = email || user.email;
    user.password = hashedPassword;
    user.contact = contact || user.contact;
    user.role = role || user.role;

    await user.save();

    res.status(200).json({ message: "User profile updated successfully" });
    console.log("success");
  } catch (e) {
    res.status(500).send(e);
    console.log(e);
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.send(users);
  } catch (e) {
    res.status(500).send(e);
  }
};

module.exports = {
  registerUser,
  loginUser,
  editUser,
  getAllUsers,
};
