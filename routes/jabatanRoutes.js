import express from 'express'
import JabatanController from '../controllers/JabatanController.js'
import AuthController from '../controllers/AuthController.js'

const router = express.Router()

router.route('/api/jabatan')
      .get(AuthController.checkSignin,JabatanController.findAll)
      .post(AuthController.checkSignin,JabatanController.create)

router.route('/api/jabatan/:id')
      .get(AuthController.checkSignin,JabatanController.read)
      .put(AuthController.checkSignin,JabatanController.update)
      .delete(AuthController.checkSignin,JabatanController.destroy)

export default router;