var Mock = require('mockjs')

var data = Mock.mock({
  'list|1-10': [{
    'id|+1': 1,
    'name': '@ctitle',
    'status': '@boolean'
  }]
})

module.exports = function(router) {
  router.get('/layout/list', (req, res, nexy) => {
    res.send({
      code: 0,
      data: data.list,
      total: 10
    })
  })
}
