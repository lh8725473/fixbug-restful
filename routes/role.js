const router = require('koa-router')()
const roleCtrl = require('../controllers/roleController')

router.prefix('/role')

router.post('/', roleCtrl.addRole)
// router.post('/login', companyCtrl.login)
// router.get('/:_id', companyCtrl.findUser)
// router.get('/', companyCtrl.findList)

module.exports = router
