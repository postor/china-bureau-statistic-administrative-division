const loadVillage = require('./village')

module.exports = async (page, url) => {
  console.log(url)
  await page.goto(url, { waitUntil: 'domcontentloaded' })
  console.log('domcontentloaded')
  await page.waitForSelector('.villagetr', { timeout: 5000 })
  console.log('.villagetr found')

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