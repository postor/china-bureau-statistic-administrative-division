const loadTown = require('./town')
const loadVillage = require('./village')
const retryPage = require('./page')
const { cachedFn } = require('./db')
const eval = require('./eval-county-or-town')

module.exports = async (page, url) => {

  const arr = await cachedFn(url, async () => {
    if (!url) {
      console.log('empty url!')
      return []
    }
    console.log(url)
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 5000 })
    console.log('domcontentloaded')
    try {
      console.log('trying .countytr ...')
      await page.waitForSelector('.countytr', { timeout: 5000 })
      console.log('.countytr found')
      return {
        type: 'county',
        children: await eval(page, '.countytr')
      }
    } catch (e) {
      console.log(e)
      console.log('trying .towntr ...')
      await page.waitForSelector('.towntr', { timeout: 5000 })
      console.log('.townytr found')
      return {
        type: 'town',
        children: await eval(page, '.towntr')
      }
    }
  })

  if (arr.length) {
    return await loadFn(arr,loadTown)
  } 
  
  if (arr.type == 'county') {
    return await loadFn(arr.children,loadTown)
  } 
  
  if (arr.type == 'town') {
    return await loadFn(arr.children,loadVillage)
  } 
  
  throw 'this path should not go!'

  async function loadFn(arr, fn) {
    var eArr = arr[Symbol.iterator]()
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
          return await fn(page, value.href)
        })
      })
    }
    return rtn
  }
}