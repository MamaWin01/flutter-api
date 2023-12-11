import Gaji from '../models/gaji.js'
import generator from '../helpers/generator.js'
import extend from 'lodash/extend.js'

const GajiProjections = {
  '_id': false,
  '__v': false
}

const findAll = async (req, res) => {
  try {
    let result = await Gaji.find({}, GajiProjections).populate("karyawan jabatan kehadiran")
    return res.status(200).json({result})
  } catch (err) {
    return res.status(500).json({
      error: err.messages
    })
  }
}

const create = async (req, res) => {
  req.body.id = generator.generateId(6)
  
  const gaji = new Gaji(req.body)
  try {
    let result = await gaji.save()
    return res.status(200).json({
      messages: 'Gaji successfully added',
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
    const gaji = await Gaji.findOne({id: req.params.id}, GajiProjections)
    return res.status(200).json(gaji)
  } catch (err) {
    return res.status(500).json({
      error: err.messages
    })
  }

}

const update = async (req, res) => {
    try {
        var gaji = await Gaji.findOne({id: req.params.id})
        gaji = extend(gaji, req.body)
        gaji.updated = Date.now()
        await gaji.save()
        gaji.hashed_password = undefined
        gaji.salt = undefined
        res.json(gaji)
      } catch (err) {
        return res.status(500).json({
          error: err.messages
        })
      }
}

const destroy = async (req, res) => {
  try {
    await Gaji.deleteOne({id: req.params.id})
    return res.status(200).json({
      messages: 'Successfully deleted gaji'
    })
  } catch (err) {
    return res.status(500).json({
      error: err.messages
    })
  }
}

const gajiById = async (req, res, next, id) => {
  try {
    const gaji = await Gaji.findOne({id})
    req.gaji = gaji
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
  gajiById
}