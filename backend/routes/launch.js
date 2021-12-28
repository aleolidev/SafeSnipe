const express = require('express')
const upload = require('../libs/storage')
const { addLaunch, getLaunch } = require('../controllers/launchController')
const api = express.Router()


api.post('/launch', upload.single('tokenIcon'), addLaunch)
api.get('/launch', getLaunch)

module.exports = api