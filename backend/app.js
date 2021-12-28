const express = require('express')
const bodyParser = require('body-parser')
const launchRoutes = require('./routes/launch')

const app = express()

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

app.use('/public', express.static(`${__dirname}/tmp/my-uploads`))

app.use('/v1', launchRoutes)

module.exports = app