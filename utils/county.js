const loadTown = require('./town')
const retryPage = require('./page')
const { cachedFn } = require('./db')

module.exports = async (page, url) => {

  const counties = await cachedFn(url, async () => {
    if(!url){
      console.log('empty url!')
      return []
    }
    console.log(url)
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 5000 })
    console.log('domcontentloaded')
    await page.waitForSelector('.countytr', { timeout: 5000 })
    console.log('.countytr found')
    return await page.$$eval('.countytr', $arr => {
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

  var eArr = counties[Symbol.iterator]()
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
        return await loadTown(page, value.href)
      })
    })
  }


  return rtn
}