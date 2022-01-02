const Launch = require('../models/Launch')

async function addLaunch(req, res) {

    try {   
        const {
            // Token Info
            pinksaleUrl,
            tokenName,
            tokenSymbol,
            tokenIconUrl,

            hasKYC,
            hasAudit,
            auditLink,

            presaleAddress,
            presaleAddressBscScan,
            tokenAddress,
            tokenAddressBscScan,

            minBuy,
            maxBuy,

            softCap,
            hardCap,

            presaleStart,
            presaleEnd,

            //Social Media
            website,
            telegram,
            twitter,
            instagram,
            facebook,
            discord,
            reddit,
            youtube,
            github,
            unknownSites,

            // Telegram
            telegramUsers,

            // Website
            websiteCreationDate
        } = req.body

        const filter = { 
            'tokenName': tokenName, 
            'tokenSymbol': tokenSymbol 
        }
        
        const update = { 
            'pinksaleUrl': pinksaleUrl,
            'tokenName': tokenName,
            'tokenSymbol': tokenSymbol,
            'tokenIconUrl': tokenIconUrl,
            'hasKYC': hasKYC,
            'hasAudit': hasAudit,
            'auditLink': auditLink,
            'presaleAddress': presaleAddress,
            'presaleAddressBscScan': presaleAddressBscScan,
            'tokenAddress': tokenAddress,
            'tokenAddressBscScan': tokenAddressBscScan,
            'minBuy': minBuy,
            'maxBuy': maxBuy,
            'softCap': softCap,
            'hardCap': hardCap,
            'presaleStart': presaleStart,
            'presaleEnd': presaleEnd,
            'website': website,
            'telegram': telegram,
            'twitter': twitter,
            'instagram': instagram,
            'facebook': facebook,
            'discord': discord,
            'reddit': reddit,
            'youtube': youtube,
            'github': github,
            'unknownSites': unknownSites,
            'telegramUsers': telegramUsers,
            'websiteCreationDate': websiteCreationDate
        }
        
        const launchStored = await Launch.findOneAndUpdate(filter, update, { 
            upsert: true, new: true 
        })

        res.status(201).send({ launchStored })
    } catch (e) {
        console.log(e)
        res.status(500).send({ message: e.message })
    }
}

async function getLaunch (req, res) {
    // TODO: pagination for results
    const launch = await Launch.find().lean().exec()
    res.status(200).send({ launch })
}

module.exports = { addLaunch, getLaunch }