import mongoose from 'mongoose'

const transactionSchema = new mongoose.Schema({
  id: String,
  name: String,
  email: String,
  type: Number,
  status: Number,
  amount: Number,
  category: String,
  user_id: {
    type: mongoose.Schema.ObjectId,
    ref: 'Users'
  }
})

export default mongoose.model('Transaction', transactionSchema, 'Transaction');