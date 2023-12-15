import express from 'express'
import ExpenseTrackerController from '../controllers/ExpenseTrackerController.js'

const router = express.Router()

router.route('/api/MainPage')
      .get(ExpenseTrackerController.getMainPage)
      .post(ExpenseTrackerController.addTransaction)

router.route('/api/addBankOrEWallet')
      .get(ExpenseTrackerController.getBankAndEWallet)
      .post(ExpenseTrackerController.getBankAndEWallet)   

export default router;