import Jabatan from '../models/jabatan.js'
import generator from '../helpers/generator.js'
import extend from 'lodash/extend.js'
import Karyawan from '../models/karyawan.js'
import Kehadiran from '../models/kehadiran.js'
import Gaji from '../models/gaji.js'

const JabatanProjections = {
  '_id': false,
  '__v': false
}

const findAll = async (req, res) => {
  try {
    let result = await Jabatan.find({}, JabatanProjections)
    return res.status(200).json({result})
  } catch (err) {
    return res.status(500).json({
      error: err.messages
    })
  }
}

const create = async (req, res) => {
  req.body.id = generator.generateId(6)
  if(!req.body.name || req.body.name == '') {
    return res.status(200).json({
      error: "Nama harus terisi",
      data: req.body
    })
  }
  if(!req.body.pokok || req.body.pokok == '') {
    return res.status(200).json({
      error: "Gaji pokok harus terisi",
      data: req.body
    })
  }
  if(!req.body.transportasi || req.body.transportasi == '') {
    return res.status(200).json({
      error: "Biaya transportasi harus terisi",
      data: req.body
    })
  }
  if(!req.body.makan || req.body.makan == '') {
    return res.status(200).json({
      error: "Biaya makan harus terisi",
      data: req.body
    })  
  }
  const jabatan = new Jabatan(req.body)
  try {
    let result = await jabatan.save()
    return res.status(200).json({
      messages: 'Jabatan successfully added',
      result
    })
  } catch (err) {
    return res.status(500).json({
      error: err.messages
    })
  }
}

const read = async (req, res) => {
  try {
    const jabatan = await Jabatan.findOne({id: req.params.id}, JabatanProjections)
    return res.status(200).json(jabatan)
  } catch (err) {
    return res.status(500).json({
      error: err.messages
    })
  }

}

const update = async (req, res) => {
  try {
    var jabatan = await Jabatan.findOne({id: req.params.id})
    req.body.backupid = req.params.id
    if(!req.body.name || req.body.name == '') {
      return res.status(200).json({
        error: "Nama harus terisi",
        data: req.body
      })
    }
    if(!req.body.pokok || req.body.pokok == '') {
      return res.status(200).json({
        error: "Gaji pokok harus terisi",
        data: req.body
      })
    }
    if(!req.body.transportasi || req.body.transportasi == '') {
      return res.status(200).json({
        error: "Biaya transportasi harus terisi",
        data: req.body
      })
    }
    if(!req.body.makan || req.body.makan == '') {
      return res.status(200).json({
        error: "Biaya makan harus terisi",
        data: req.body
      })  
    }
    jabatan = extend(jabatan, req.body)
    jabatan.updated = Date.now()
    await jabatan.save()
    jabatan.hashed_password = undefined
    jabatan.salt = undefined
    res.json(jabatan)
  } catch (err) {
    return res.status(500).json({
      error: err.messages
    })
  }
}

const destroy = async (req, res) => {
  try {
    var jabatan = await Jabatan.findOne({id:req.params.id})
    var karyawan = await Karyawan.find({jabatan: jabatan._id})
    karyawan.map(async (data) => {
      data.jabatan = null
      data.updated = Date.now()
      var kehadiran = await Kehadiran.findOne({karyawan: data._id})
      var gaji = await Gaji.findOne({karyawan: data._id})
      await gaji.deleteOne()
      await kehadiran.deleteOne()
      await data.deleteOne()
    })
    await Jabatan.deleteOne({id: req.params.id})
    return res.status(200).json({
      messages: 'Successfully deleted jabatan'
    })
  } catch (err) {
    return res.status(500).json({
      error: err.messages
    })
  }
}

const jabatanById = async (req, res, next, id) => {
  try {
    const jabatan = await Jabatan.findOne({id})
    req.jabatan = jabatan
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
  jabatanById
}