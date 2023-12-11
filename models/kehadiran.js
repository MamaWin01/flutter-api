import mongoose from 'mongoose'

const kehadiranSchema = new mongoose.Schema({
  id: String,
  karyawan: {
    type: mongoose.Schema.ObjectId,
    ref: 'Karyawan'
  },
  hadir: Number,
  sakit: Number,
  izin: Number
})

export default mongoose.model('Kehadiran', kehadiranSchema, 'Kehadiran');