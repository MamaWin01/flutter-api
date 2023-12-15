import express from 'express'
import ExpenseTrackerController from '../controllers/ExpenseTrackerController.js'

const router = express.Router()

router.route('/api/MainPage')
    .post(ExpenseTrackerController.getMainPage)

router.route('/api/addTransaction')
    .post(ExpenseTrackerController.addTransaction)

      
router.route('/api/getBankOrEWallet')
    .post(ExpenseTrackerController.getBankAndEWallet)

router.route('/api/addBankOrEWallet')
    .post(ExpenseTrackerController.getBankAndEWallet)   

export default router;