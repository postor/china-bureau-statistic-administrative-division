var Datastore = require('nedb')
  , db = new Datastore({ filename: 'db.nedb' })


module.exports.init = () => {
  return new Promise((resolve, reject) => {
    db.loadDatabase((err) => {
      if (err) {
        reject(err)
        return
      }
      resolve()
    })
  })
}


module.exports.insert = insert

module.exports.find = find

module.exports.cachedFn = async (_id, fn) => {
  const cached = await find(_id)
  if (cached) {
    console.log(`found cache for ${_id}`)
    console.log(cached)
    return cached
  }

  const rtn = await fn()
  const doc = {
    ...rtn,
    _id,
  }
  await insert(doc)
  return doc
}

function insert(doc) {
  return new Promise((resolve, reject) => {
    db.insert(doc, (err) => {
      if (err) {
        reject(err)
        return
      }
      resolve()
    })
  })
}

function find(_id) {
  return new Promise((resolve, reject) => {
    db.findOne({ _id }, function (err, doc) {
      if (err) {
        reject(err)
        return
      }
      resolve(doc)
    })
  })
}