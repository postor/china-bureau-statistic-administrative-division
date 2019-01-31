const puppeteer = require('puppeteer')
const P = require('free-http-proxy')

const t = new P()
let loaded = false, proxy

async function getPage() {
  if (!loaded) {
    await t.loadPage()
    loaded = true
  }

  proxy = await t.getProxy(!!proxy)
  const { ip, port } = proxy

  const browser = await puppeteer.launch({
    args: [
      `--proxy-server=${ip}:${port}`,
      "--no-sandbox",
      "--disable-setuid-sandbox"
    ]
  })
  const page = await browser.newPage()
  await page.setDefaultNavigationTimeout(5000);

  return {
    page,
    close: async () => {
      await page.close()
      await browser.close()
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
      console.log(e)
      close()
      continue
    }
  }
}