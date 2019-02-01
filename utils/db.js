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
    return cached.data
  }

  const rtn = await fn()
  if (!rtn) {
    console.log(`fn failed in cachedFn`)
    return rtn
  }

  const doc = {
    data: rtn,
    _id,
  }

  console.log(`setting cache for ${_id}`)
  await insert(doc)
  return rtn
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