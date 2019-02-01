const fs = require('fs-extra')
const argv = require('yargs').argv
const getProvinces = require('./utils/province')
const pageRetry = require('./utils/page')
const { init } = require('./utils/db')

process.on('uncaughtException', function (err) {
  console.log('Caught exception: ', err);
  process.exit(1)
})

const {
  url = 'http://www.stats.gov.cn/tjsj/tjbz/tjyqhdmhcxhfdm/2018/index.html',
  output = 'china.json',
} = argv;

(async () => {
  await init()
  await pageRetry.init()
  try {
    await pageRetry(async (page) => {
      const provinces = await getProvinces(page, url)
      await fs.writeJSON(output, provinces)
      console.log(`result file: ${output}`)
    })
  } catch (e) {
    console.log(e)
  }
})()
