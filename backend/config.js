const config =  {
    appConfig: {
        host: process.env.APP_HOST,
        port: process.env.APP_PORT,
        launchPath: process.env.APP_LAUNCH_PATH
    },
    dbConfig : {
        port: process.env.DB_PORT,
        host: process.env.DB_HOST,
        dbName: process.env.DB_NAME   
    }
}

module.exports = config