import AccountModel from '../models/account.js';
import jwt from 'jsonwebtoken';
import { expressJwt } from 'express-jwt'; // Correct import statement
import extend from 'lodash/extend.js';

// setup process.env
import dotenv from 'dotenv';
dotenv.config();

const jwtsecret = process.env.JWTSECRET; // Make sure your .env variable matches

const login = async (req, res, next) => {
  console.log(req.body);
  let user = await AccountModel.findOne({ 'name': req.body.name });

  if (!user || !user.authenticate(req.body.password)) {
    return res.status(401).json({
      error: 'Name or password anda tidak sesuai'
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

// ... (other functions remain unchanged)

const checkSignin = expressJwt({
  secret: jwtsecret,
  algorithms: ["HS256"],
  userProperty: 'auth'
});

export default {
  login,
  register,
  logout,
  update,
  getStatus,
  checkSignin // Include checkSignin in the export
};
