import mongoose from 'mongoose'

const userBalanceSchema = new mongoose.Schema({
  id: String,
  name: String,
  email: String,
  balance: Number,
  user_id: {
    type: mongoose.Schema.ObjectId,
    ref: 'Users'
  }
})

export default mongoose.model('User_balances', userBalanceSchema, 'User_balances');