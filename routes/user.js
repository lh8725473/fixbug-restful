const router = require('koa-router')()
const userctrl = require('../controllers/userController')
const Joi = require('joi')
const validate = require('koa2-validation')
const path = require('path')
const fs = require('fs')

const userValidate = {
  register: {
    body: {
      username: Joi.string().required(),
      password: Joi.string().required()
    }
  },
  login: {
    body: {
      username: Joi.string().required(),
      password: Joi.string().required()
    }
  },
  findUserById: {
    params: {
      _id: Joi.string().hex().required()
    }
  },
  findList: {
    query: {
      companyName: Joi.string()
    }
  },
  updateUser: {
    params: {
      _id: Joi.string().hex().required()
    },
    body: {
      username: Joi.string(),
      password: Joi.string()
    }
  }
}

router.prefix('/user')

router.post('/register', validate(userValidate.register), userctrl.register)
  .post('/login', validate(userValidate.login), userctrl.login)
  .get('/findUserByName', userctrl.findUserByName)
  .get('/own', userctrl.own)
  .get('/:_id', userctrl.findUserById)
  .get('/', validate(userValidate.findList), userctrl.findList)
  .put('/:_id', validate(userValidate.updateUser), userctrl.updateUser)
  .post('/uploadFile', async (ctx, next) => {
    const file = ctx.request.files.file
    const reader = fs.createReadStream(file.path)
    let filePath = path.resolve('public/upload') + `/${file.name}`
    console.log(filePath)
    const stream = fs.createWriteStream(filePath)
    reader.pipe(stream)
    console.log('uploading %s -> %s', file.name, stream.path)
    stream.on('finish', () => {
      console.log('写入完成')
    })
    ctx.body = {
      code: 1,
      url: `upload/${file.name}`
    }
    // // 上传单个文件
    // const file = ctx.request.files.file // 获取上传文件
    // // 创建可读流
    // const reader = fs.createReadStream(file.path)
    // let filePath = path.join(__dirname, 'public/upload') + `/${file.name}`
    // console.log(filePath)
    // // 创建可写流
    // const upStream = fs.createWriteStream(filePath)
    // // 可读流通过管道写入可写流
    // reader.pipe(upStream)
    // ctx.body = '上传成功！'
  })

module.exports = router
