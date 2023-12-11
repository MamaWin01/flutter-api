import AccountModel from '../models/account.js'
import jwt from 'jsonwebtoken'
import { expressjwt } from 'express-jwt'
import extend from 'lodash/extend.js'

// setup process.env
import dotenv from 'dotenv'
import account from '../models/account.js'
dotenv.config();

const jwtsecret = process.env.jwtsecret

const login = async (req, res, next) => {
  console.log(req.body)
  let user = await AccountModel.findOne({'name': req.body.name})

  if(!user || !user.authenticate(req.body.password)){
    return res.status(401).json({
      error: 'Name or password anda tidak sesuai'
    })
  }

  const token = jwt.sign({
    _id: user._id
  }, jwtsecret, {
    algorithm: "HS256"
  })

  res.cookie("t", token, {
    expire: new Date() + 9999
  })

  return res.json({
    token,
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
    }
  })
}

const register = async (req, res, next) => {
    const user = new AccountModel(req.body)
    if(req.body.password) {
      if(req.body.password.length < 6) {
        return res.status(200).json({
          error: "Password harus melebihi 6 huruf"
        })
      }
    } else {
      if(!req.body.name) {
        return res.status(200).json({
          error: "Nama harus terisi"
        })
      }
      if(!req.body.email) {
        return res.status(200).json({
          error: "Email harus terisi"
        })
      }
      if(!req.body.password) {
        return res.status(200).json({
          error: "Password harus terisi"
        })
      }
    }
    const validName = await AccountModel.findOne({name:req.body.name})
    if(validName) {
      return res.status(200).json({
        error: "Nama sudah terpakai"
      })
    }
    try {
        await user.save()
        return res.status(200).json({
          message: 'Successfully signed up'
        })
      } catch (err){
        return res.status(500).json({
          error: err.message
        })
      }
}

const logout = async (req, res, next) => {
    res.clearCookie("t")
    return res.status(200).json({
      message: "Signed out"
    })
  }

const update = async (req, res) => {
    try {
      var user = await AccountModel.findOne({name: req.body.name})
      if(req.body.new_password.length < 6) {
        return res.status(500).json({
          error: "Password harus melebihi 6 huruf"
        })
      }
      if(!user.authenticate(req.body.password)) {
        return res.status(500).json({
          error: "Paswword atau nama anda salah"
        })
      }
      req.body.name = req.body.new_name
      req.body.password = req.body.new_password
      user = extend(user, req.body)
      await user.save()
      user.hashed_password = undefined
      user.salt = undefined
      res.json(user)
    } catch (err) {
      return res.status(500).json({
        error: err.messages
      })
    }
  }

const checkSignin = expressjwt({
    secret: jwtsecret,
    algorithms: ["HS256"],
    userProperty: 'auth'
  })

const getStatus = async(req, res) => {
  console.log('test');
  return res.json({'status':200, 'message':'OK!'});
}
export default {
  login,
  register,
  logout,
  update,
  getStatus,
}