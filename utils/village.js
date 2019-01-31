const loadVillage = require('./village')

module.exports = async (page, url) => {
  await page.goto(url)
  await page.waitForSelector('.villagetr')

  const villages = await page.$$eval('.villagetr', $arr => {
    return $arr.map($tr => {
      $aNo = $tr.children[0]
      $aType = $tr.children[1]
      $aName = $tr.children[2]

      return {
        no: $aNo.innerText.trim(),
        type: $aType.innerText.trim(),
        text: $aName.innerText.trim()
      }
    })
  })

  console.log(villages)
  return villages
}