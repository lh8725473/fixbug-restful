const router = require('koa-router')()
const bugCtrl = require('../controllers/bugController')

router.prefix('/bug')

router.post('/add', bugCtrl.addBug)
router.get('/list', bugCtrl.bugList)
router.post('/update', bugCtrl.updateBug)
router.get('/getBugById', bugCtrl.getBugById)
// router.get('/:_id', companyCtrl.findUser)
// router.get('/', companyCtrl.findList)

module.exports = router
