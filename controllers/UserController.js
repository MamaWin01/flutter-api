import AccountModel from '../models/account.js'
import UserBalance from '../models/user_balance.js'
import jwt from 'jsonwebtoken'
import { expressjwt } from 'express-jwt'
import extend from 'lodash/extend.js'
import generator from '../helpers/generator.js'

// setup process.env
import dotenv from 'dotenv'
import account from '../models/account.js'
dotenv.config();

const jwtsecret = `${process.env.jwtsecret}`

const login = async (req, res, next) => {
  console.log(req.body)
  let user = await AccountModel.findOne({'email': req.body.email})

  if(!user || !user.authenticate(req.body.password)){
    return res.status(401).json({
      error: 'Email or password anda tidak sesuai'
    })
  }

  // const token = jwt.sign({
  //   _id: user._id
  // }, jwtsecret, {
  //   algorithm: "HS256"
  // })

  const token = jwt.sign({
      _id: user._id,
      name: user.name,
      email: user.email,
    }, jwtsecret, {expiresIn:'1h'})

  res.cookie("t", token, {
    expire: new Date() + 9999
  })

  return res.status(200).json({
    token,
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
    }
  })
}

const register = async (req, res, next) => {
    req.body.profile_image = null;
    const user = new AccountModel(req.body)
    console.log(req.body);
    if(req.body.password) {
      if(req.body.password.length < 6) {
        return res.status(201).json({
          error: "Password harus melebihi 6 huruf"
        })
      }
      if(!req.body.name) {
        return res.status(201).json({
          error: "Nama harus terisi"
        })
      }
      if(!req.body.email) {
        return res.status(201).json({
          error: "Email harus terisi"
        })
      }
      if(!req.body.password) {
        return res.status(201).json({
          error: "Password harus terisi"
        })
      }
    } else {
      if(!req.body.name) {
        return res.status(201).json({
          error: "Nama harus terisi"
        })
      }
      if(!req.body.email) {
        return res.status(201).json({
          error: "Email harus terisi"
        })
      }
      if(!req.body.password) {
        return res.status(201).json({
          error: "Password harus terisi"
        })
      }
    }
    const validEmail = await AccountModel.findOne({email:req.body.email})
    if(validEmail) {
      return res.status(201).json({
        error: "Email sudah terpakai"
      })
    }
    try {
        await user.save()
        const user_id = await AccountModel.findOne({email:req.body.email});
        const DataUserBal = {
          'id':generator.generateId(6),
          'name': req.body.name,
          'email':req.body.email,
          'user_id':user_id,
          'balance': 0
        }
      
        const UserBal = new UserBalance(DataUserBal)
        await UserBal.save()
        
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
      var user = await AccountModel.findOne({email: req.body.email})
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