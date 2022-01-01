const puppeteer = require('puppeteer')

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

    let total_time = 0
    let launches_tested = 0

    for await (const launchURI of launched) {
        const start =  Date.now()
        const launchInfo = await getLaunchInfo(browser, launchURI)
        const end = Date.now()
        launches_tested++
        total_time += (end - start)

        console.log(`Average execution time: ${total_time / launches_tested} ms`)
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

async function getLaunchInfo(browser, launchURI) {

    let launch_info = {}
    const launch = await browser.newPage()
    await launch.goto(launchURI, {waitUntil: 'networkidle0', timeout: 120000}) // Waits until the page is completely loaded

    launch_info['tokenName'] = await getLaunchValue(launch, "Token Name", "")
    launch_info['tokenSymbol'] = await getLaunchValue(launch, "Token Symbol", "")

    launch_info['tokenIconUrl'] = await getTokenIconUrl(launch)

    launch_info['hasKYC'] = await getHasKYC(launch)
    launch_info['auditLink'] = await getAuditLink(launch)
    launch_info['hasAudit'] = launch_info['auditLink'] != null && launch_info['auditLink'] != undefined && launch_info['auditLink'] != ''

    launch_info['presaleAddress'] = await getLaunchValue(launch, "Presale Address", "//a")
    launch_info['presaleAddressBscScan'] = await getLaunchParam(launch, "Presale Address", "//a")
    launch_info['tokenAddress'] = await getLaunchValue(launch, "Token Address", "//a")
    launch_info['tokenAddressBscScan'] = await getLaunchParam(launch, "Token Address", "//a")
    
    launch_info['minBuy'] = await getLaunchValue(launch, "Minimum Buy", "")
    launch_info['maxBuy'] = await getLaunchValue(launch, "Maximum Buy", "")
    
    launch_info['softCap'] = await getLaunchValue(launch, "Soft Cap", "")
    launch_info['hardCap'] = await getLaunchValue(launch, "Hard Cap", "")
    
    launch_info['presaleStart'] = await getLaunchValue(launch, "Presale Start Time", "")
    launch_info['presaleEnd'] = await getLaunchValue(launch, "Presale End Time", "")

    // Get social media
    launch_info = Object.assign({}, launch_info, await getLaunchSocialMedia(launch))
    console.log(launch_info)

    launch.close()
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
        console.log(`Error trying to catch the parameter '${value_string}': ${e}`)
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
        console.log(`Error trying to catch the parameter '${value_string}': ${e}`)
        return null
    }
}

async function getTokenIconUrl(page) {
    const xpath = '//article[contains(@class, "media") and contains(@class, "pool-detail")]/img'

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

async function getTextByXPath(page, XPath) {
    const element = await getElementByXPath(page, XPath)
    const msg = await page.evaluate(name => name.innerText, element)
    return msg 
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

module.exports = scrapePinksale