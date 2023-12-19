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
    
export default router;