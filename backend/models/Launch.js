const mongoose = require('mongoose')
const { appConfig } = require('../config')

const Schema = mongoose.Schema

const LaunchSchema = Schema({
    tokenName: String,
    tokenSymbol: String,
    tokenIconUrl: String,
    website: String,
    telegram: String,
    twitter: String,
    discord: String,
    reddit: String,
    youtube: String,
    github: String,
}, {
    timestamps: true
}) 

LaunchSchema.methods.setTokenIconUrl = function setTokenIconUrl (filename) {
    const { host, port } = appConfig
    this.tokenIconUrl = `${host}:${port}/public/${filename}`
}

module.exports = mongoose.model('Launch', LaunchSchema)