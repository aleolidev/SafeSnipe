require('dotenv').config()

const app = require('./app')
const connectDb = require('./db/mongodb')
const { appConfig, dbConfig } = require('./config')

async function initApp(appConfig, dbConfig) {
    try {
        await connectDb(dbConfig)
        app.listen(appConfig.port, () => console.log('Listening on port', appConfig.port, '-> http://localhost:' + appConfig.port))
    } catch (e){
        console.error(e)
        process.exit(0)
    }
}

initApp(appConfig, dbConfig)