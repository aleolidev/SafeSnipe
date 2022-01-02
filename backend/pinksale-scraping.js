const scrapePinksale = require('./launch-scraping')

async function initApp() {
    try {
        await scrapePinksale()
    } catch (e){
        console.error(e)
        process.exit(0)
    }
}

initApp()