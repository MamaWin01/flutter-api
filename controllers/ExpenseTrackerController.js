import UserBalance from '../models/user_balance.js'
import UserBank from '../models/user_bank.js'
import EWallet from '../models/ewallet.js'
import Transaction from '../models/transaction.js'
import generator from '../helpers/generator.js'
import extend from 'lodash/extend.js'

const getMainPage = async(req, res) => {
  console.log(req.body)
  try {
    const userBal = await UserBalance.findOne({email:req.body.email})
    const ewallet = await EWallet.findOne({email:req.body.email});
    const transaction = await Transaction.find({email:req.body.email}).sort({date_created: 1}).limit(5);
    const data = {
      'userBal':userBal ? userBal.balance : 0,
      'ewallet':ewallet ? ewallet.balance : 0,
      'transaction':transaction ? transaction : null
    }
    console.log(data)
    return res.status(200).json(data)
  } catch (err) {
    return res.status(500).json({
      error: err.messages
    })
  }
}

const getBankAndEWallet = async(req, res) => {

  return res.status(200).json({'status':'yeyy'})
}

const addTransaction = async(req, res) => {
  req.body.id = generator.generateId(6)
  console.log(req.body);
  try {
    var userData = await UserBalance.findOne({email:req.body.email})
    const eWallet = await EWallet.findOne({email:req.body.email})
    req.body.user_id = userData.user_id
    const trans = new Transaction(req.body)
    await trans.save()
    if(req.body.status == 0) {
      const newBal = {
        'balance':userData.balance - req.body.amount,
      }
      userData = extend(userData, newBal)
      userData.updated = Date.now()
      await userData.save()
    } else {
      const newBal = {
        'balance':Number(userData.balance) + Number(req.body.amount),
      }
      userData = extend(userData, newBal)
      userData.updated = Date.now()
      await userData.save()
    }

    return res.status(200).json({
      message: 'Successfully add Transactions'
    })
  } catch(err) {
    console.log(err)
    return res.status(500).json({
      error: err.messages
    })
  }
  return res.status(200).json({'status':'yes'})
}

const addBankAndEWallet = async(req, res) => {

  return res.status(200).json({'status':'yeyy'})
}

export default {
  getMainPage,
  addTransaction,
  getBankAndEWallet,
  addBankAndEWallet,
}