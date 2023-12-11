import Karyawan from '../models/karyawan.js'
import Jabatan from '../models/jabatan.js'
import generator from '../helpers/generator.js'
import extend from 'lodash/extend.js'
import Kehadiran from '../models/kehadiran.js'
import Gaji from '../models/gaji.js'
import jabatan from '../models/jabatan.js'

const KaryawanProjections = {
  '_id': false,
  '__v': false
}

const findAll = async (req, res) => {
  try {
    let result = await Karyawan.find({}, KaryawanProjections).populate("jabatan")
    return res.status(200).json({result})
  } catch (err) {
    return res.status(500).json({
      error: err.messages
    })
  }
}

const create = async (req, res) => {
  req.body.id = generator.generateId(6)
  console.log(req.body)

  if(!req.body.name || req.body.name == '') {
    return res.status(200).json({
      error: "Nama harus terisi",
      data: req.body
    })
  }
  if(!req.body.alamat || req.body.alamat == '') {
    return res.status(200).json({
      error: "Alamat harus terisi",
      data: req.body
    })
  }
  if(!req.body.nohp || req.body.nohp == '') {
    return res.status(200).json({
      error: "No Hp harus terisi",
      data: req.body
    })
  }
  if(isNaN(req.body.nohp)) {
    return res.status(200).json({
      error: "No Hp harus berisi angka",
      data: req.body
    })
  }
  if(!req.body.gender || req.body.gender == '') {
    return res.status(200).json({
      error: "Jenis kelamin harus terisi",
      data: req.body
    })  
  }
  if(!req.body.jabatan || req.body.jabatan == '') {
    return res.status(200).json({
      error: "Jabatan harus terisi",
      data: req.body
    })  
  }

  const jabatanid = await Jabatan.findOne({id:req.body.jabatan})
  req.body.jabatan = jabatanid

  const karyawan = new Karyawan(req.body)

  const dataKehadiran = {
    'id':generator.generateId(6),
    'karyawan':karyawan._id,
    'hadir': 0,
    'sakit': 0,
    'izin': 0
  }

  const kehadiran = new Kehadiran(dataKehadiran)
  await kehadiran.save()
  
  const dataGaji = {
    'id':generator.generateId(6),
    'karyawan': karyawan._id,
    'jabatan': jabatanid,
    'kehadiran': kehadiran._id
  }
  const gaji = new Gaji(dataGaji)
  await gaji.save()
  try {
    let result = await karyawan.save()
    return res.status(200).json({
      messages: 'Karyawan successfully added',
      result
    })
  } catch (err) {
    return res.status(500).json({
      error: 'Karyawan failed to be added',
    })
  }
}

const read = async (req, res) => {
  try {
    const karyawan = await Karyawan.findOne({id: req.params.id}, KaryawanProjections).populate("jabatan")
    return res.status(200).json(karyawan)
  } catch (err) {
    return res.status(500).json({
      error: err.messages
    })
  }

}

const update = async (req, res) => {
    console.log(req.body)
    var karyawan = await Karyawan.findOne({id: req.params.id})
    var jabatan  = await Jabatan.findOne({id: req.body.jabatan})
    req.body.backupid = req.params.id
    if(!req.body.name || req.body.name == '') {
      return res.status(200).json({
        error: "Nama harus terisi",
        data: req.body
      })
    }
    if(!req.body.alamat || req.body.alamat == '') {
      return res.status(200).json({
        error: "Alamat harus terisi",
        data: req.body
      })
    }
    if(!req.body.nohp || req.body.nohp == '') {
      return res.status(200).json({
        error: "No Hp harus terisi",
        data: req.body
      })
    }
    if(isNaN(req.body.nohp)) {
      return res.status(200).json({
        error: "No Hp harus berisi angka",
        data: req.body
      })
    }
    if(!req.body.gender || req.body.gender == '') {
      return res.status(200).json({
        error: "Jenis kelamin harus terisi",
        data: req.body
      })  
    }
    if(!req.body.jabatan || req.body.jabatan == '') {
      return res.status(200).json({
        error: "Jabatan harus terisi",
        data: req.body
      })  
    }
    req.body.jabatan = jabatan._id
    karyawan = extend(karyawan, req.body)
    karyawan.updated = Date.now()
  try {
    await karyawan.save()
    karyawan.hashed_password = undefined
    karyawan.salt = undefined
    res.json(karyawan)
  } catch (err) {
    return res.status(500).json({
      error: err.messages
    })
  }
}

const destroy = async (req, res) => {
  const karyawan = await Karyawan.findOne({id:req.params.id})
  await Kehadiran.deleteOne({karyawan:karyawan._id})
  await Gaji.deleteOne({karyawan:karyawan._id})
  try {
    await Karyawan.deleteOne({id: req.params.id})
    return res.status(200).json({
      messages: 'Successfully deleted karyawan'
    })
  } catch (err) {
    return res.status(500).json({
      error: err.messages
    })
  }
}

const karyawanById = async (req, res, next, id) => {
  try {
    const karyawan = await Karyawan.findOne({id})
    req.karyawan = karyawan
    next()
  } catch (err) {
    return res.status(500).json({
      error: err.messages
    })
  }
}

export default {
  findAll,
  create,
  read,
  update,
  destroy,
  karyawanById
}