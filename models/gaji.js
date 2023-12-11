import mongoose from 'mongoose'

const gajiSchema = new mongoose.Schema({
  id: String,
  karyawan: {
    type: mongoose.Schema.ObjectId,
    ref: 'Karyawan'
  },
  jabatan: {
    type: mongoose.Schema.ObjectId,
    ref: 'Jabatan'
  },
  kehadiran: {
    type: mongoose.Schema.ObjectId,
    ref: 'Kehadiran'
  }
})

export default mongoose.model('Gaji', gajiSchema, 'Gaji');