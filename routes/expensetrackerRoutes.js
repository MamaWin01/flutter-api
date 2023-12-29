import express from 'express'
import ExpenseTrackerController from '../controllers/ExpenseTrackerController.js'

const router = express.Router()

router.route('/api/MainPage')
    .post(ExpenseTrackerController.getMainPage)

router.route('/api/addTransaction')
    .post(ExpenseTrackerController.addTransaction)

router.route('/api/getTransaction')
    .post(ExpenseTrackerController.getTransaction)

router.route('/api/getBankOrEWallet')
    .post(ExpenseTrackerController.getBankAndEWallet)

router.route('/api/addBankOrEWallet')
    .post(ExpenseTrackerController.addBankAndEWallet)   

router.route('/api/editBankOrEWallet')
    .post(ExpenseTrackerController.editBankAndEWallet)  
    
router.route('/api/deleteBankOrEWallet')
    .post(ExpenseTrackerController.deleteBankAndEWallet)  

router.route('/api/editAccount')
    .post(ExpenseTrackerController.editAccount)  
    
router.route('/api/deleteAccount')
    .post(ExpenseTrackerController.deleteAccount)  

router.route('/api/getAccountInfo')
    .post(ExpenseTrackerController.getAccountInfo)  

router.route('/api/validationPassword')
    .post(ExpenseTrackerController.validationAccountPassword) 

export default router;