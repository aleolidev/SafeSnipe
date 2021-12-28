const mongoose = require('mongoose')

mongoose.connection.on('open', () => console.log('Database connected.'))

async function connectDb({ host, port, dbName })
{
    const uri = `mongodb://${host}:${port}/${dbName}`
    await mongoose.connect(uri, { useNewUrlParser : true })   
}

function dropCollection(collection) {
    mongoose.connection.db.dropCollection(collection, function(err, res) {
        if (!err) {
            console.log(`'${collection}' dropped correctly.`)
        } else {    
            console.log(`Error trying to drop the collection '${collection}' from the database.`)
        }
        
        mongoose.connection.close()
    })
}

module.exports = { connectDb, dropCollection }