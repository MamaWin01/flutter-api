import User from '../models/account.js';
import jwt from 'jsonwebtoken';
import { expressJwt } from 'express-jwt'; // Correct import statement

// setup process.env
import dotenv from 'dotenv';
dotenv.config();

const jwtsecret = process.env.JWTSECRET;

const signin = async (req, res, next) => {
  console.log(req.body);
  let user = await User.findOne({'name': req.body.name});

  if (!user || !user.authenticate(req.body.password)) {
    return res.status(401).json({
      error: 'Email or password not match'
    });
  }

  const token = jwt.sign({
    _id: user._id
  }, jwtsecret, {
    algorithm: "HS256"
  });

  res.cookie("t", token, {
    expire: new Date() + 9999
  });

  return res.json({
    token,
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
    }
  });
};

const signout = async (req, res, next) => {
  res.clearCookie("t");
  return res.status(200).json({
    message: "Signed out"
  });
};

const checkSignin = expressJwt({ // Correct method name
  secret: jwtsecret,
  algorithms: ["HS256"],
  userProperty: 'auth'
});

export default {
  signin,
  signout,
  checkSignin
};
