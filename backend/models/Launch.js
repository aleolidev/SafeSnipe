const mongoose = require('mongoose')
//const { appConfig } = require('../config')

const Schema = mongoose.Schema

const LaunchSchema = Schema({
    // Token Info
    pinksaleUrl: String,
    tokenName: String,
    tokenSymbol: String,
    tokenIconUrl: String,

    hasKYC: Boolean,
    hasAudit: Boolean,
    auditLink: String,

    presaleAddress: String,
    presaleAddressBscScan: String,
    tokenAddress: String,
    tokenAddressBscScan: String,

    minBuy: String,
    maxBuy: String,

    softCap: String,
    hardCap: String,

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
    unknownSites: Array,

    // Telegram
    telegramUsers: Number,

    // Website
    websiteCreationDate: String,
}, {
    timestamps: true
}) 

/*LaunchSchema.methods.setTokenIconUrl = function setTokenIconUrl (filename) {
    const { host, port } = appConfig
    this.tokenIconUrl = `${host}:${port}/public/${filename}`
}*/

module.exports = mongoose.model('Launch', LaunchSchema)