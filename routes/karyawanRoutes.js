import express from 'express'
import KaryawanController from '../controllers/KaryawanController.js'
import AuthController from '../controllers/AuthController.js'

const router = express.Router()

router.route('/api/karyawan')
      .get(AuthController.checkSignin,KaryawanController.findAll)
      .post(AuthController.checkSignin,KaryawanController.create)

router.route('/api/karyawan/:id')
      .get(AuthController.checkSignin,KaryawanController.read)
      .put(AuthController.checkSignin,KaryawanController.update)
      .delete(AuthController.checkSignin,KaryawanController.destroy)

export default router;