const loadCity = require('./city')
const retryPage = require('./page')
const { cachedFn } = require('./utils/db')

module.exports = async (page, url) => {
  console.log(url)
  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 5000 })
  console.log('domcontentloaded')
  await page.waitForSelector('.provincetr', { timeout: 5000 })
  console.log('.provincetr found')

  const provinces = await page.$$eval('.provincetr a', $arr => {
    return $arr.map(a => {
      return {
        href: a.href,
        text: a.innerText.trim()
      }
    })
  })

  var eArr = provinces[Symbol.iterator]()
  const rtn = []
  while (true) {
    const { done, value } = eArr.next()
    if (done) {
      break
    }
    console.log(value)
    rtn.push({
      ...value,
      children: await cachedFn(url, async () => await retryPage(async (page) => {
        return await loadCity(page, value.href)
      }))
    })
  }

  return rtn
}