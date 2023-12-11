import express from 'express'
import kehadiranController from '../controllers/KehadiranController.js'
import AuthController from '../controllers/AuthController.js'


const router = express.Router()

router.route('/api/kehadiran')
      .get(AuthController.checkSignin, kehadiranController.findAll)
      .post(AuthController.checkSignin, kehadiranController.create)

router.route('/api/kehadiran/:id')
      .get(AuthController.checkSignin, kehadiranController.read)
      .put(AuthController.checkSignin, kehadiranController.update)
      .delete(AuthController.checkSignin, kehadiranController.destroy)

export default router;