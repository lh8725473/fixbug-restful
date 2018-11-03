const router = require('koa-router')()
const companyCtrl = require('../controllers/companyController')

router.prefix('/company')

router.post('/', companyCtrl.addCompany)
// router.post('/login', companyCtrl.login)
// router.get('/:_id', companyCtrl.findUser)
router.get('/', companyCtrl.companyList)

module.exports = router
