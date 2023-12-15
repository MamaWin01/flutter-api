import mongoose from 'mongoose'

const userBankSchema = new mongoose.Schema({
  id: String,
  email: String,
  bank_name: String,
  balance: Number,
  user_id: {
    type: mongoose.Schema.ObjectId,
    ref: 'Users'
  }
})

export default mongoose.model('User_bank', userBankSchema, 'User_bank');