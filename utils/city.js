const loadCounty = require('./county')
const retryPage = require('./page')

module.exports = async (page, url) => {
  console.log(url)
  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 5000 })
  console.log('domcontentloaded')
  await page.waitForSelector('.citytr', { timeout: 5000 })
  console.log('.citytr found')

  const citys = await page.$$eval('.citytr', $arr => {
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

  var eArr = citys[Symbol.iterator]()
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
        return await loadCounty(page, value.href)
      })
    })
  }

  return rtn
}