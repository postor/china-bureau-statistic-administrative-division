module.exports = async (page, selector) => {
  return await page.$$eval(selector, $arr => {
    return $arr.map($tr => {
      if ($tr.children[0].children.length) {
        $aNo = $tr.children[0].children[0]
        $aName = $tr.children[1].children[0]
        return {
          no: $aNo.innerText.trim(),
          href: $aNo.href,
          text: $aName.innerText.trim()
        }
      }
      return {
        no: $tr.children[0].innerText.trim(),
        href: '',
        text: $tr.children[1].innerText.trim()
      }
    })
  })
}