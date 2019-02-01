const puppeteer = require('puppeteer')
const P = require('free-http-proxy')

const t = new P()
let proxy, browser, page

async function getPage() {
  proxy = await t.getProxy()
  const { ip, port } = proxy

  if (!browser) {
    const proxyString = `http://${ip}:${port}`
    console.log(`new browser with proxy: ${proxyString}`)
    browser = await puppeteer.launch({
      args: [
        `--proxy-server=${proxyString}`,
        "--no-sandbox",
        "--disable-setuid-sandbox"
      ]
    })
  }
  if (!page) {
    console.log(`new page: ${proxyString}`)
    page = await browser.newPage()
  }
  await page.setDefaultNavigationTimeout(5000);
  await page.setExtraHTTPHeaders({
    'referer': 'http://www.stats.gov.cn'
  })

  console.log(`new page ready:${proxyString}`)
  return {
    page,
    close: async () => {
      console.log(`clean page and browser:${proxyString}`)
      await page.close()
      await browser.close()
      page = undefined
      browser = undefined
    }
  }
}

module.exports = async (fn) => {
  while (true) {
    const { page, close } = await getPage()
    try {
      const rtn = await fn(page)
      return rtn
    } catch (e) {
      console.log(await page.evaluate(() => document.body.innerHTML))
      console.log(e)
      await t.getProxy(true)
      await close()
      continue
    }
  }
}

module.exports.init = async () => await t.loadPage()