const mongoose = require('mongoose')
const { appConfig } = require('../config')

const Schema = mongoose.Schema

const LaunchSchema = Schema({
    // Token Info
    tokenName: String,
    tokenSymbol: String,
    tokenIconUrl: String,

    presaleAddress: String,
    tokenAddress: String,

    minBuy: Number,
    maxBuy: Number,

    softCap: Number,
    hardCap: Number,

    presaleStart: Date,
    presaleEnd: Date,

    // Social Media
    website: String,
    telegram: String,
    twitter: String,
    instagram: String,
    facebook: String,
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