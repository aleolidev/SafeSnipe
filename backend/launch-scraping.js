const puppeteer = require('puppeteer')
var axios = require('axios')
var qs = require('qs')
const { appConfig, _ } = require('./config')

const pinksaleLaunchpadURI = 'https://www.pinksale.finance/#/launchpads?chain=BSC'

async function scrapePinksale() {
    const browser = await puppeteer.launch({ headless: false, defaultViewport: false, args: ['--start-maximized'] })
    const page = (await browser.pages())[0]

    await page.goto(pinksaleLaunchpadURI)
    await filterByUpcoming(page)

    await page.waitForTimeout(1500)

    await loadAllLaunches(page)

    await page.waitForTimeout(1000)

    const launched = await getLaunchesList(page)

    // let total_time = 0
    // let launches_tested = 0

    for await (const launchURI of launched) {
        try {
            // const start =  Date.now()
            
            const launchInfo = await getLaunchInfo(browser, launchURI)
            await postLaunchInfo(launchInfo)
            
            // const end = Date.now()
            // launches_tested++
            // total_time += (end - start)
    
            // console.log(`Average execution time: ${total_time / launches_tested} ms`)
        } catch (e) {
            console.log("Error trying to scrape " + launchURI)
        }
    }

}

async function filterByUpcoming(page) {
    const filterBy = await page.waitForSelector('span.ant-select-selection-item[title="All Status"]')
    if (filterBy) {
        await filterBy.click()
    }
    
    await page.waitForTimeout(2000)
    
    const upcoming = await page.waitForSelector('div.ant-select-item[title="Upcoming"] > div')
    
    if (upcoming) {
        upcoming.click()
    }
}

async function loadAllLaunches(page) {

    var loadedPools = 0, toLoadPools = 1

    const forLoop = async _ => {
        console.log('Loading all launchpad items...')
        
        // Keep loading pools untill all pools are loaded
        while (loadedPools < (toLoadPools/40)) {
            await autoScroll(page)

            await page.waitForXPath("//a[contains(., 'View more pools')]");
            const viewMore = await getElementByXPath(page, "//a[contains(., 'View more pools')]")

            try {
                await viewMore.click();
            } catch (e) {
                //console.log("Unable to click 'Load more pools' button:", e)
            }

            let loadingText = await getElementByXPath(page, "//span[contains(., 'Loading')]")
            if (loadingText) {
                loadingText = await loadingText.getProperty('innerText')
                loadingText = await loadingText.jsonValue()
    
                var regExPools = /\w*\s(\d+)\/(\d+)\s\w*/g
                var match = regExPools.exec(loadingText)

                loadedPools = parseInt(match[1])
                toLoadPools = parseInt(match[2])

                console.log(loadedPools + " of " + toLoadPools + " pools loaded.")
            }

        }
        
        console.log('Launchpad items loaded correctly.')
    }

    await forLoop()
}

async function getLaunchesList(page) {
    const launches = await page.$$('div.is-multiline > div div.view-pool > a.view-button')
    let hrefs = []

    for await (const element of launches) {
        const href = await element.getProperty('href')
        hrefs.push(await href.jsonValue())
    }

    return hrefs
}

async function postLaunchInfo(raw_data) {
    const data = qs.stringify(raw_data)

    let config = {
        method: 'post',
        url: 'http://localhost:8080/v1/launch',
        headers: { 
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        data : data
    }

    axios(config).then(function (response) {
        console.log(`'${raw_data['tokenName']}' inserted/updated successfully.`)
        //console.log(JSON.stringify(response.data));
    }).catch(function (error) {
        console.log(`There was an error while inserting/updating '${raw_data['tokenName']}': ${error}`);
    });

    /*const options = {
        hostname: appConfig.host,
        port: appConfig.port,
        path: appConfig.launchPath,
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': data.length
        }
    }*/
}

async function getLaunchInfo(browser, launchURI) {

    let launch_info = {}
    const launch = await browser.newPage()
    await launch.goto(launchURI, {waitUntil: 'networkidle0', timeout: 120000}) // Waits until the page is completely loaded

    const pinksaleUrl = launchURI
    if (isValid(pinksaleUrl)) { launch_info['pinksaleUrl'] = pinksaleUrl }
    const tokenName = await getLaunchValue(launch, "Token Name", "")
    if (isValid(tokenName)) { launch_info['tokenName'] = tokenName }
    const tokenSymbol = await getLaunchValue(launch, "Token Symbol", "")
    if (isValid(tokenSymbol)) { launch_info['tokenSymbol'] = tokenSymbol }

    const tokenIconUrl = await getTokenIconUrl(launch)
    if (isValid(tokenIconUrl)) { launch_info['tokenIconUrl'] = await tokenIconUrl }

    launch_info['hasKYC'] = await getHasKYC(launch)
    const auditLink = await getAuditLink(launch)
    if (isValid(auditLink)) { launch_info['auditLink'] = auditLink }
    launch_info['hasAudit'] = isValid(auditLink)

    const presaleAddress = await getLaunchValue(launch, "Presale Address", "//a")
    if (isValid(presaleAddress)) { launch_info['presaleAddress'] = presaleAddress }
    const presaleAddressBscScan = await getLaunchParam(launch, "Presale Address", "//a")
    if (isValid(presaleAddressBscScan)) { launch_info['presaleAddressBscScan'] = presaleAddressBscScan }
    const tokenAddress = await getLaunchValue(launch, "Token Address", "//a")
    if (isValid(tokenAddress)) { launch_info['tokenAddress'] = tokenAddress }
    const tokenAddressBscScan = await getLaunchParam(launch, "Token Address", "//a")
    if (isValid(tokenAddressBscScan)) { launch_info['tokenAddressBscScan'] = tokenAddressBscScan }
    
    const minBuy = await getLaunchValue(launch, "Minimum Buy", "")
    if (isValid(minBuy)) { launch_info['minBuy'] = minBuy }
    const maxBuy = await getLaunchValue(launch, "Maximum Buy", "")
    if (isValid(maxBuy)) { launch_info['maxBuy'] = maxBuy }

    const softCap = await getLaunchValue(launch, "Soft Cap", "")
    if (isValid(softCap)) { launch_info['softCap'] = softCap }
    const hardCap = await getLaunchValue(launch, "Hard Cap", "")
    if (isValid(hardCap)) { launch_info['hardCap'] = hardCap }
    
    const presaleStart = await getLaunchValue(launch, "Presale Start Time", "")
    if (isValid(presaleStart)) { launch_info['presaleStart'] = presaleStart }
    const presaleEnd = await getLaunchValue(launch, "Presale End Time", "")
    if (isValid(presaleEnd)) { launch_info['presaleEnd'] = presaleEnd }

    // Get social media
    launch_info = Object.assign({}, launch_info, await getLaunchSocialMedia(launch))

    if (launch_info['telegram'] != null && launch_info['telegram'] != undefined && launch_info['telegram'] != '') {
        launch_info['telegramUsers'] = await getTelegramUsers(browser, launch_info['telegram'])
    } else {
        launch_info['telegramUsers'] = 0
    }

    if (launch_info['website'] != null && launch_info['website'] != undefined && launch_info['website'] != '') {
        const websiteCreationDate = await getWebsiteCreationDate(browser, launch_info['website'])
        if (isValid(websiteCreationDate)) { launch_info['websiteCreationDate'] = websiteCreationDate }
    }

    //console.log(launch_info)
    launch.close()

    return launch_info
}

async function getLaunchValue(page, value_string, extra_xpath) {
    const xpath = '//tr[contains(., "' + value_string + '")]//td[contains(@class, "has-text-right")]' + extra_xpath

    try {
        const [param_elem] = await page.$x(xpath)
        const param_innerText = await param_elem.getProperty('innerText')
        const param_data = await param_innerText.jsonValue()

        if (param_data) {
            return param_data
        } else {
            return null
        }
        
    } catch (e){
        //console.log(`Error trying to catch the parameter '${value_string}': ${e}`)
        return null
    }
}


async function getLaunchParam(page, value_string, extra_xpath) {
    const xpath = '//tr[contains(., "' + value_string + '")]//td[contains(@class, "has-text-right")]' + extra_xpath

    try {
        const [param_elem] = await page.$x(xpath)
        const href = await param_elem.getProperty('href')
        const param_data = await href.jsonValue()
        
        return param_data
        
    } catch (e){
        //console.log(`Error trying to catch the parameter '${value_string}': ${e}`)
        return null
    }
}

async function getTokenIconUrl(page) {
    //const xpath = '//article[contains(@class, "media") and contains(@class, "pool-detail")]/img'

    try {
        const icon_url = await page.$eval('article.pool-detail img', img => img.getAttribute('src'));
        
        return icon_url
    } catch (e){
        // Error trying to catch parameter
        return null
    }
}

async function getAuditLink(page) {
    const xpath = '//a[contains(@class, "tag") and contains(., "Audit")]'

    try {
        const [audit_link] = await page.$x(xpath)
        const href = await audit_link.getProperty('href')
        const param_data = await href.jsonValue()
        
        return param_data
        
    } catch (e){
        // Error trying to catch parameter
        return null
    }
}

async function getHasKYC(page) {
    const xpath = '//a[contains(@class, "tag") and contains(., "KYC")]'

    try {
        const [tag_KYC] = await page.$x(xpath)
        
        return tag_KYC != null && tag_KYC != undefined && tag_KYC != ''
    } catch (e){
        // Error trying to catch parameter
        return false
    } 
}

async function getLaunchSocialMedia(page) {

    const known_sites = {
        "telegram": "t.me",
        "twitter": "twitter.com",
        "instagram": "instagram.com",
        "facebook": "facebook.com",
        "discord": ["discord.com", "discord.gg"],
        "reddit": "reddit.com",
        "youtube": "youtube.com",
        "github": "github.com"
    }

    const launches = await page.$$('a.mr-4.is-size-5')

    let hrefs = []
    let social_media = {}

    for await (const element of launches) {
        const href = await element.getProperty('href')
        hrefs.push(await href.jsonValue())
    }
    
    parseSocialMedia(hrefs, known_sites, social_media)

    return social_media
}

function parseSocialMedia(launch_sites, known_sites, social_media) {
    let website_found = false

	for (const launch_site of launch_sites) {
        let hostname_found = false
        let regex_URL = /https?:\/\/(?:www\.)?([-a-zA-Z0-9@:%._\+~#=]{1,256})/g
        let matches = regex_URL.exec(launch_site)
        const hostname_matched = matches[1]

        for (const [site_name, hostname] of Object.entries(known_sites))
        {
            if (Array.isArray(hostname)) {
                for (const sub_hostname of hostname) {
                    if (hostname_matched.includes(sub_hostname)) {
                        social_media[site_name] = launch_site
                        hostname_found = true
                    }
                }
            } else {
                if (hostname_matched.includes(hostname)) {
                    social_media[site_name] = launch_site
                    hostname_found = true
                }
            }
        }

        if(!hostname_found && !website_found) {
            social_media['website'] = launch_site
            website_found = true
        } else if (!hostname_found) {
            if (!('unknownSites' in social_media)) {
                social_media['unknownSites'] = []
            }
            social_media['unknownSites'].push(launch_site)
        }
    }
}

// Telegram

async function getTelegramUsers(browser, url) {
    const xpath = '//div[contains(@class, "tgme_page_extra")]'
    const number_regex = /^[^\d]*(\d+)/g

    const telegram = await browser.newPage()

    // Close alert box if it appears
    telegram.on('dialog', async dialog => {
        await dialog.dismiss()
        await telegram.waitForTimeout(1500)
    })
    
    await telegram.goto(url, {waitUntil: 'networkidle0'}) // Waits until the page is completely loaded
    

    try {
        const [page_extra] = await telegram.$x(xpath)
        const page_extra_innerText = await page_extra.getProperty('innerText')
        let page_extra_data = await page_extra_innerText.jsonValue()
        page_extra_data = page_extra_data.replaceAll(" ", "")

        const match = number_regex.exec(page_extra_data)
        const users_amount = parseInt(match[1])

        telegram.close()
        
        return users_amount
    } catch (e){
        // Error trying to catch parameter
        telegram.close()
        return 0
    } 
}

// Website

async function getWebsiteCreationDate(browser, url) {
    const xpath = '//div[contains(@class, "queryResponseBodyRow") and contains(., "Registered On")]//div[contains(@class, "queryResponseBodyValue")]'
    const regex_URL = /https?:\/\/(?:www\.)?([-a-zA-Z0-9@:%._\+~#=]{1,256})/g
    
    const matches = regex_URL.exec(url)
    const hostname_matched = matches[1]

    const whois = await browser.newPage()

    await whois.goto("https://who.is/whois/" + hostname_matched, {waitUntil: 'networkidle0'}) // Waits until the page is completely loaded  

    try {
        const [date_element] = await whois.$x(xpath)
        const date_innerText = await date_element.getProperty('innerText')
        let date_data = await date_innerText.jsonValue()

        whois.close()
        
        if (isValid(date_data)) { return date_data.replaceAll('-', '.') }
        return null
    } catch (e){
        // Error trying to catch parameter
        whois.close()
        return null
    } 
}

async function getElementByXPath(page, XPath) {
    try {
        await page.waitForXPath(XPath, { visible: true, timeout: 1000 })
        let [loadingText] = await page.$x(XPath)
        return loadingText
    } catch {
        return null
    }
}

async function autoScroll(page){
    await page.evaluate(async () => {
        await new Promise((resolve, reject) => {
            var totalHeight = 0;
            var distance = 20;
            var timer = setInterval(() => {
                var scrollHeight = document.body.scrollHeight;
                window.scrollBy(0, distance);
                totalHeight += distance;

                if(totalHeight >= scrollHeight){
                    clearInterval(timer);
                    resolve();
                }
            }, 5);
        });
    });
}

function isValid(value) {
    return value != null && value != undefined && value != ''
}

module.exports = scrapePinksale