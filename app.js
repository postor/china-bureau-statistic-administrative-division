const fs = require('fs-extra')
const argv = require('yargs').argv
const getProvinces = require('./utils/province')
const pageRetry = require('./utils/page')
const { cachedFn } = require('./utils/db')

process.on('uncaughtException', function (err) {
  console.log('Caught exception: ', err);
})

const {
  url = 'http://www.stats.gov.cn/tjsj/tjbz/tjyqhdmhcxhfdm/2018/index.html',
  output = 'china.json',
} = argv;

(async () => {
  await pageRetry(async (page) => {
    const provinces = await cachedFn(url, async () => await getProvinces(page, url))
    await fs.writeJSON(output, provinces)
    console.log(`result file: ${output}`)
  })
})()
