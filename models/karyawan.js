import mongoose from 'mongoose'

const karyawanSchema = new mongoose.Schema({
  id: String,
  name: String,
  alamat: String,
  nohp: Number,
  gender: String,
  jabatan: {
    type: mongoose.Schema.ObjectId,
    ref: 'Jabatan'
  }
})

export default mongoose.model('Karyawan', karyawanSchema, 'Karyawan');