import Kehadiran from '../models/kehadiran.js'
import extend from 'lodash/extend.js'

const KehadiranProjections = {
  '_id': false,
  '__v': false
}

const findAll = async (req, res) => {
  try {
    let result = await Kehadiran.find({}, KehadiranProjections).populate("karyawan")
    return res.status(200).json({result})
  } catch (err) {
    return res.status(500).json({
      error: err.messages
    })
  }
}

const create = async (req, res) => {
  req.body.id = generator.generateId(6)
  
  const kehadiran = new Kehadiran(req.body)
  try {
    let result = await kehadiran.save()
    return res.status(200).json({
      messages: 'Kehadiran successfully added',
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
    const kehadiran = await Kehadiran.findOne({id: req.params.id}, KehadiranProjections)
    return res.status(200).json(kehadiran)
  } catch (err) {
    return res.status(500).json({
      error: err.messages
    })
  }

}

const update = async (req, res) => {
  try {
    var kehadiran = await Kehadiran.findOne({id: req.params.id}).populate("karyawan")
    if(req.body.hadir == null || req.body.hadir == '') {
      req.body.hadir = '0'
    }
    if(req.body.izin == null || req.body.izin == '') {
      req.body.izin = '0'
    }
    if(req.body.sakit == null || req.body.sakit == '') {
      req.body.sakit = '0'
    }
    kehadiran = extend(kehadiran, req.body)
    kehadiran.updated = Date.now()
    await kehadiran.save()
    kehadiran.hashed_password = undefined
    kehadiran.salt = undefined
    res.json(kehadiran)
  } catch (err) {
    return res.status(500).json({
      error: err.messages
    })
  }
}

const destroy = async (req, res) => {
  try {
    await Kehadiran.deleteOne({id: req.params.id})
    return res.status(200).json({
      messages: 'Successfully deleted kehadiran'
    })
  } catch (err) {
    return res.status(500).json({
      error: err.messages
    })
  }
}

const kehadiranById = async (req, res, next, id) => {
  try {
    const kehadiran = await Kehadiran.findOne({id})
    req.kehadiran = kehadiran
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
  kehadiranById
}