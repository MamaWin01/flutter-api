import UserBalance from '../models/user_balance.js'
import UserBank from '../models/user_bank.js'
import EWallet from '../models/ewallet.js'
import Transaction from '../models/transaction.js'
import generator from '../helpers/generator.js'
import extend from 'lodash/extend.js'
import UserModel from '../models/account.js'
import transaction from '../models/transaction.js'

const getMainPage = async(req, res) => {
  try {
    const userBal = await UserBalance.findOne({email:req.body.email})
    const ewallet = await EWallet.find({email:req.body.email});
    const transaction = await Transaction.find({email:req.body.email}).sort({$natural: -1}).limit(5);
    var ewallBal = 0;
    for(var i of ewallet) {
      ewallBal += i.balance
    }
    const data = {
      'userBal':userBal ? userBal.balance : 0,
      'ewallet':ewallet ? ewallBal : 0,
      'transaction':transaction ? transaction : null
    }
    console.log(data)
    return res.status(200).json(data)
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      error: err.messages
    })
  }
}

const getBankAndEWallet = async(req, res) => {
  try {
    if(req.body.type == 0) {
      var TypeInfo = await UserBank.find({email:req.body.email})
    } else {
      var TypeInfo = await EWallet.find({email:req.body.email})
    }
    return res.status(200).json({
      'data':TypeInfo
    })
  } catch(err) {
    return res.status(500).json({
      error: err.messages
    })
  }
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
}

const addBankAndEWallet = async(req, res) => {
  if(req.body.type == 1) {
    var infoName = 'E-wallet';
  } else {
    var infoName = 'bank';
  }
  if(!req.body.name) {
    return res.status(201).json({
      error: 'Nama ' + infoName + ' harus terisi'
    })
  }
  if(!req.body.amount) {
    return res.status(201).json({
      error: 'Jumlah '+ infoName +' harus terisi'
    })
  }
  if(infoName == 'bank') {
    var validName = await UserBank.findOne({bank_name:req.body.name,email:req.body.email})
  } else {
    var validName = await EWallet.findOne({wallet_name:req.body.name,email:req.body.email})
  }
  if(validName) {
    return res.status(201).json({
      error: 'Nama '+ infoName +' sudah terdaftar'
    })
  }
  try {
    var Account = await UserModel.findOne({email:req.body.email})
    if(infoName == 'E-wallet') {
      const data = {
        'id': generator.generateId(6),
        'email': req.body.email,
        'user_id': Account._id,
        'wallet_name':req.body.name,
        'balance':req.body.amount
      }
      const Listtrans = {
        'id': generator.generateId(6),
        'date_created': formatDate(Date()),
        'name': Account.name,
        'email': Account.email,
        'user_id': Account._id,
        'amount': req.body.amount,
        'desc': 'Add New EWallet ' + req.body.name,
        'status': 1,
        'type': 1,
      }
      var ewallet = new EWallet(data)
      await ewallet.save()
      var trans = new Transaction(Listtrans)
      await trans.save()
    } else {
      var userBal = await UserBalance.findOne({email:req.body.email});
      const data = {
        'id': generator.generateId(6),
        'email': req.body.email,
        'user_id': userBal._id,
        'bank_name':req.body.name,
        'balance':req.body.amount
      }
      const Listtrans = {
        'id': generator.generateId(6),
        'date_created': formatDate(Date()),
        'name': Account.name,
        'email': Account.email,
        'user_id': Account._id,
        'amount': req.body.amount,
        'desc': 'Add New Bank ' + req.body.name,
        'status': 1,
        'type': 0,
      }
      var bank = new UserBank(data)
      await bank.save()
      const ListBal = {
        'balance': userBal.balance + req.body.amount,
      }
      var trans = new Transaction(Listtrans)
      await trans.save()
      userBal = extend(userBal, ListBal)
      await userBal.save();
    }
    return res.status(200).json({
      message: 'Successfully add '+ infoName
    })
  } catch(err) {
    return res.status(500).json({
      error: err.messages
    })
  }
}

const editBankAndEWallet = async(req, res) => {
  if(req.body.type == 0) {
    var infoName = 'bank';
  } else {
    var infoName = 'E-wallet'
  }
  if(!req.body.name) {
    return res.status(201).json({
      error: 'Nama ' + infoName + ' harus terisi'
    })
  }
  if(!req.body.amount) {
    return res.status(201).json({
      error: 'Jumlah '+ infoName +' harus terisi'
    })
  }if(infoName == 'bank') {
    var validName = await UserBank.findOne({bank_name:req.body.name})
  } else {
    var validName = await EWallet.findOne({wallet_name:req.body.name})
  }
  if(validName) {
    return res.status(201).json({
      error: 'Nama '+ infoName +' sudah terdaftar'
    })
  }
  try {
    if(infoName == 'E-wallet') {
      const data = {
        'wallet_name':req.body.name,
        'balance':req.body.amount
      }
      var ewallet = await EWallet.findOne({_id:req.body.id})
      ewallet = extend(ewallet, data)
      await ewallet.save()
    } else {
      const data = {
        'bank_name':req.body.name,
        'balance':req.body.amount
      }
      var bank = await UserBank.findOne({_id:req.body.id})
      bank = extend(bank, data)
      await bank.save()
    }
    return res.status(200).json({
      message: 'Successfully update '+ infoName
    })
  } catch(err) {
    return res.status(500).json({
      error: err.messages
    })
  }
}

const deleteBankAndEWallet = async(req, res) => {
  if(req.body.type == 0) {
    var infoName = 'bank';
  } else {
    var infoName = 'E-wallet'
  }
  try {
    if(infoName == 'E-wallet') {
      var ewallet = await EWallet.deleteOne({_id:req.body.id})
    } else {
      var bank = await UserBank.deleteOne({_id:req.body.id})
    }
    return res.status(200).json({
      message: 'Successfully delete '+ infoName
    })
  } catch(err) {
    return res.status(500).json({
      error: err.messages
    })
  }
}

const editAccount = async(req, res) => {
  
}

const deleteAccount = async(req, res) => {
  
}


const getTransaction = async(req, res) => {
  var query = [];

  if(req.body.date_created == '' && req.body.status == '' && req.body.type == '') {
    console.log('aaa');
    var transaction = await Transaction.find({email:req.body.email}).sort({$natural: -1}).limit(100);
    return res.status(200).json({'transaction':transaction})
  }

  query['email'] = req.body.email;
  if(req.body.date_created != '' && req.body.date_created != null) {
    query['date_created'] = req.body.date_created;
  } 

  if((req.body.status != '' && req.body.status != null) || req.body.status == '0') {
    query['status'] = req.body.status;
  } 

  if((req.body.type != '' && req.body.type != null) || req.body.type == '0') {
    query['type'] = req.body.type;
  }

  const obj = {...query};
  console.log(obj);
  var transaction = await Transaction.find(obj).sort({$natural: -1});
  
  return res.status(200).json({'transaction':transaction})
}

function formatDate(date) {
  var d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();

  if (month.length < 2) 
      month = '0' + month;
  if (day.length < 2) 
      day = '0' + day;

  return [year, month, day].join('-');
}

export default {
  getMainPage,
  addTransaction,
  getTransaction,
  getBankAndEWallet,
  addBankAndEWallet,
  editBankAndEWallet,
  deleteBankAndEWallet,
  editAccount,
  deleteAccount,
}