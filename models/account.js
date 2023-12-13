import mongoose from 'mongoose'
import crypto from 'crypto'

const AccountSchema = new mongoose.Schema({
    name: String,
    email: String,
    hashed_password: {
      type: String,
      // required: "Password is required"
    },
    salt: String,
  })
  
  AccountSchema
    .virtual('password')
    .set(function(password) {
      this._password = password
      this.salt = this.makeSalt()
      this.hashed_password = this.encryptPassword(password)
    })
    .get(function() {
      return this._password
    })
  
  AccountSchema.path('hashed_password').validate(function(v) {
    if (this._password && this._password.length < 6) {
      this.invalidate('password', 'Password must be at least 6 characters.')
    }
  
    if (!this._password) {
      this.invalidate('password', 'Password is required')
    }
  }, null)
  
  AccountSchema.methods = {
    authenticate: function(plainText) {
      return this.encryptPassword(plainText) === this.hashed_password
    },
    encryptPassword: function(password) {
      if (!password) return ''
      try {
        return crypto
          .createHmac('sha1', this.salt)
          .update(password)
          .digest('hex')
      } catch (err) {
        return ''
      }
    },
    makeSalt: function() {
      return Math.round((new Date().valueOf() * Math.random())) + ''
    }
  }

export default mongoose.model('expense_tracker', AccountSchema, 'Users');