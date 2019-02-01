const loadCity = require('./city')
const retryPage = require('./page')
const { cachedFn } = require('./db')

module.exports = async (page, url) => {

  const provinces = await cachedFn(url, async () => {
    if(!url){
      console.log('empty url!')
      return []
    }
    console.log(url)
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 5000 })
    console.log('domcontentloaded')
    await page.waitForSelector('.provincetr', { timeout: 5000 })
    console.log('.provincetr found')
    return await page.$$eval('.provincetr a', $arr => {
      return $arr.map(a => {
        return {
          href: a.href,
          text: a.innerText.trim()
        }
      })
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
      children: await retryPage(async (page) => {
        return await loadCity(page, value.href)
      })
    })
  }

  return rtn
}