const express = require('express')
const upload = require('../libs/storage')
const { addLaunch, getLaunch } = require('../controllers/launchController')

const api = express.Router()
const cors = require('cors')

api.use(cors())
api.post('/launch', upload.single('tokenIcon'), addLaunch)
api.get('/launch', (req, res) => {
    getLaunch(res, req.query)
})

module.exports = api