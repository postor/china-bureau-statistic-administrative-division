const P = require('free-http-proxy')

const t = new P();
//const t = new P('https://free-proxy-list.net/uk-proxy.html');

(async ()=>{
  await t.loadPage()
  console.log(await t.getProxy())
  console.log(await t.getProxy(true)) //force update
  console.log(await t.getProxy(true)) //force update
  console.log(await t.getProxy(true)) //force update
  console.log(await t.getProxy())
  console.log(await t.getProxy())
})()