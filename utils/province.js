const loadCity = require('./city')
const retryPage = require('./page')

module.exports = async (page, url) => {
  console.log(url)
  await page.goto(url)
  await page.waitForSelector('.provincetr')

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
      children: await retryPage(async (page)=>{
        return await loadCity(page, value.href)
      })
    })
  }

  return rtn
}