const Launch = require('../models/Launch')

async function addLaunch(req, res) {
    try {   
        const {
            tokenName,
            tokenSymbol,
            website,
            telegram,
            twitter,
            discord,
            reddit,
            youtube,
            github
        } = req.body

        const launch = Launch({
            tokenName,
            tokenSymbol,
            website,
            telegram,
            twitter,
            discord,
            reddit,
            youtube,
            github
        })

        
        if (req.file) {
            const { filename } = req.file
            launch.setTokenIconUrl(filename)
        }

        const launchStored = await launch.save()

        res.status(201).send({ launchStored })
    } catch (e) {
        res.status(500).send({ message: e.message })
    }
}

async function getLaunch (req, res) {
    // TODO: pagination for results
    const launch = await Launch.find().lean().exec()
    res.status(200).send({ launch })
}

module.exports = { addLaunch, getLaunch }