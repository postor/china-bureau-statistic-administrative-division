const puppeteer = require('puppeteer')
const argv = require('yargs').argv
const getProvinces = require('./utils/province')

const { url = 'http://www.stats.gov.cn/tjsj/tjbz/tjyqhdmhcxhfdm/2018/index.html' } = argv;

(async () => {
  const browser = await puppeteer.launch({
    devtools: true
  })

  const page = await browser.newPage()
  const provinces = await getProvinces(page, url)
  console.log(provinces)
  await page.close()
  await browser.close()
})()
