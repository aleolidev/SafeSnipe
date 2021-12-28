require('dotenv').config()

const mongodb = require('./mongodb')
const { _, dbConfig } = require('../config')

async function initApp(dbConfig) {
    try {
        await mongodb.connectDb(dbConfig)
        mongodb.dropCollection('launches')
    } catch (e){
        console.error(e)
        process.exit(0)
    }
}

initApp(dbConfig)