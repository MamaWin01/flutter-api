import express from 'express'
import UserController from '../controllers/UserController.js'
import AuthController from '../controllers/AuthController.js'

const router = express.Router()

router.route('/api/login')
      .post(UserController.login)

router.route('/api/register')
      .post(UserController.register)

router.route('/api/logout')
      .get(UserController.logout)

router.route('/api/user/:id')
      .put(AuthController.checkSignin,UserController.update)

router.route('/api/getAPIStatus')
      .get(UserController.getStatus)

export default router
