require('dotenv').config()

const app = require('./app')
const mongodb = require('./db/mongodb')
const scrapePinksale = require('./launch-scraping')
const { appConfig, dbConfig } = require('./config')

async function initApp(appConfig, dbConfig) {
    try {
        await mongodb.connectDb(dbConfig)
        app.listen(appConfig.port, () => console.log('Listening on port', appConfig.port, '-> http://localhost:' + appConfig.port))
        await scrapePinksale()
    } catch (e){
        console.error(e)
        process.exit(0)
    }
}

initApp(appConfig, dbConfig)