import mongoose from 'mongoose'

const ewalletSchema = new mongoose.Schema({
  id: String,
  email: String,
  wallet_name: String,
  balance: Number,
  user_id: {
    type: mongoose.Schema.ObjectId,
    ref: 'Users'
  }
})

export default mongoose.model('EWallet', ewalletSchema, 'EWallet');