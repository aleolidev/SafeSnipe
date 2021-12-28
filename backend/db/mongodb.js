const mongoose = require('mongoose')

mongoose.connection.on('open', () => console.log('Database connected.'))

async function connectDb({ host, port, dbName })
{
    const uri = `mongodb://${host}:${port}/${dbName}`
    await mongoose.connect(uri, { useNewUrlParser : true })   
}

module.exports = connectDb