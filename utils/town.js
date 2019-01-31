const loadVillage = require('./village')

module.exports = async (page, url) => {
  await page.goto(url)
  await page.waitForSelector('.towntr')

  const towns = await page.$$eval('.towntr', $arr => {
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

  var eArr = towns[Symbol.iterator]()
  const rtn = []
  while (true) {
    const { done, value } = eArr.next()
    if (done) {
      break
    }

    rtn.push({
      ...value,
      children: await loadVillage(page, value.href)
    })
  }


  return rtn
}