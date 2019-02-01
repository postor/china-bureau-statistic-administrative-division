const { cachedFn } = require('./db')

module.exports = async (page, url) => {

  const villages = await cachedFn(url, async () => {
    if(!url){
      console.log('empty url!')
      return []
    }
    console.log(url)
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 5000 })
    console.log('domcontentloaded')
    await page.waitForSelector('.villagetr', { timeout: 5000 })
    console.log('.villagetr found')
    return await page.$$eval('.villagetr', $arr => {
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
  })

  console.log(villages)
  return villages
}