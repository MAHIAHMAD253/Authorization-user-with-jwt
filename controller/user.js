const User = require("../model/user");
const bcrypt = require("bcrypt");
const { response } = require("express");
const jwt = require("jsonwebtoken");
const {jwtAuth} = require('../midleware/jwtVerifation')
const dotenv = require('dotenv');
dotenv.config();

// all user get in api

const getuser = async (req, resp) => {
  try {
    const user = await User.find();
    resp.status(200).json(user);
  } catch (error) {
    console.log(error);
    resp.status(500).json({ err: message });
  }
};

//  Athorization and create user
// register a user
// SignUp user

const createUser = async (req, resp) => {
  let { name, password, email } = req.body;

  try {
    const passwordHash = await bcrypt.hash(password, 10);

    const user = await User({ name, email, password: passwordHash });

    await user
      .save()
      .then(() => {
        let temUser = {};
        temUser.name = user.name;
        temUser.email = user.email;
        temUser._id = user._id;
        resp.status(200).json({ message: "Created user", data: temUser });
      })
      .catch((err) => {
        resp.status(500).json({ err: err.message });
      });
  } catch (error) {
    resp.status(500).json({ error: " internal error " });
  }
};

// user signIn it means that loging user

const signIn = async (req, resp) => {
  let { email, password } = req.body;

  try {
    const user = await User.findOne({ email: email });
    if (!user) {
      return resp.status(500).json({ message: "wrong email" });
    }

    let passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return resp.status(500).json({ message: "wrong match password" });
    } else {
      let temUser = {};
      temUser.email = user.email;
      // temUser._id = user._id

      // this apply is jwtToken

      let jwtOptinal = {
        expiresIn: 3600,
        jwtid: "0123456",
        issuer: "=1234567",
      };
      // jwt sign token
      const jwtToken = jwt.sign({ id: user._id },process.env.SECRET_KEY,jwtOptinal);

      resp.status(201).json({message: "logged user sucessfull !",user: temUser, token: jwtToken,});
    }
  } catch (error) {
    resp.status(500).json({ error: err.message });
  }
};

// user change password yah forget password yah newpassword

const changeUser = async (req, resp) => {
  let { email, password, newpassword } = req.body;

  try {
    const user = await User.findOne({ email: email });

    if (!user) {
      return resp.status(404).json({ message: "Invlid change user" });
    }

    let passMatch = await bcrypt.compare(password, user.password);
    if (!passMatch) {
      return resp.status(401).json({ message: " wrong matchpassword" });
    }

    // update password a user

    const newPasswordHash = await bcrypt.hash(newpassword, 10);

    user.newpassword = newPasswordHash;

    // jwt token:  aouthorization in headers

    let token = req.headers.authorization;
    if (!token) {
      return resp.status(404).json({ message: "unaothorization token is missing" });
    }
    token = token.split(" ")[1];

    // jwt token is verify apply

    jwt.verify(token, process.env.SECRET_KEY, async (err, response) => {
      if (err) {
        return resp.status(401).json({ message: "auaothorizatio is invlaid" });
      }

      await user.save().then(() => {

          resp.status(201).json({message: "logged user is updated sucessfull !",data: user,});

        }).catch((err) => {

          resp.status(404).json({ message: err.message });
        });
    });

  } catch (error) {
    return resp.status(500).json({ message: err.message });
  }
};

module.exports = { getuser, createUser, signIn, changeUser };
