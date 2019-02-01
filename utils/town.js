const loadVillage = require('./village')
const retryPage = require('./page')
const { cachedFn } = require('./db')

module.exports = async (page, url) => {

  const towns = await cachedFn(url, async () => {
    console.log(url)
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 5000 })
    console.log('domcontentloaded')
    await page.waitForSelector('.towntr', { timeout: 5000 })
    console.log('.towntr found')
    return await page.$$eval('.towntr', $arr => {
      return $arr.map($tr => {
        $aNo = $tr.children[0].children[0]
        $aName = $tr.children[1].children[0]
        return {
          no: $aNo.innerText.trim(),
          href: $aNo.href,
          text: $aName.innerText.trim()
        }
      })
    })
  })

  var eArr = towns[Symbol.iterator]()
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
        return await loadVillage(page, value.href)
      })
    })
  }


  return rtn
}