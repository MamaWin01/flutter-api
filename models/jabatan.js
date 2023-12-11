import mongoose from 'mongoose'

const JabatanSchema = new mongoose.Schema({
  id: String,
  name: String,
  pokok: String,
  transportasi: String,
  makan: String
})

export default mongoose.model('Jabatan', JabatanSchema, 'Jabatan');