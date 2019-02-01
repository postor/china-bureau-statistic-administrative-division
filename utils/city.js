const loadCounty = require('./county')
const retryPage = require('./page')
const { cachedFn } = require('./db')

module.exports = async (page, url) => {
  const citys = await cachedFn(url, async () => {
    if(!url){
      console.log('empty url!')
      return []
    }
    console.log(url)
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 5000 })
    console.log('domcontentloaded')
    await page.waitForSelector('.citytr', { timeout: 5000 })
    console.log('.citytr found')
    return await page.$$eval('.citytr', $arr => {
      return $arr.map($tr => {
        if ($tr.children[0].children.length) {
          $aNo = $tr.children[0].children[0]
          $aName = $tr.children[1].children[0]
          return {
            no: $aNo.innerText.trim(),
            href: $aNo.href,
            text: $aName.innerText.trim()
          }
        }
        return {
          no: $tr.children[0].innerText.trim(),
          href: '',
          text: $tr.children[1].innerText.trim()
        }
      })
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