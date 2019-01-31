const loadCity = require('./city')

module.exports = async (page, url) => {
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

    rtn.push({
      ...value,
      children: await loadCity(page, value.href)
    })
  }


  return rtn
}