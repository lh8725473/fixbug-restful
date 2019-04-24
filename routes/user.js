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

router
  .post('/register', validate(userValidate.register), userctrl.register)
  .post('/login', validate(userValidate.login), userctrl.login)
  .get('/findUserByName', userctrl.findUserByName)
  .get('/own', userctrl.own)
  .get('/:_id', userctrl.findUserById)
  .get('/', validate(userValidate.findList), userctrl.findList)
  .put('/:_id', validate(userValidate.updateUser), userctrl.updateUser)
  .post('/uploadFileNew', async (ctx, next) => {
    console.log(ctx.request)
    let str = ''
    ctx.req.on('data', function (chunk) {
      str += chunk
    })
    ctx.req.on('end', function (chunk) {
      console.log('end')
    })
    ctx.body = {
      code: 1,
      url: ctx.request.body
    }
  })
  .post('/uploadFile', async (ctx, next) => {
    // console.log(ctx.request.files)
    // console.log(Buffer.from(ctx.request.body.data, 'hex'))
    // function toBuffer (ab) {
    //   console.log(ab.length)
    //   var buf = Buffer.from(ab.length)
    //   var view = new Uint8Array(ab)
    //   for (var i = 0; i < buf.length; ++i) {
    //     buf[i] = view[i]
    //   }
    //   console.log(buf)
    //   return buf
    // }
    // fs.writeFile(path.resolve('public/upload') + `/test.txt`, Buffer.from(ctx.request.body.data), (err) => {
    //   // throws an error, you could also catch it here
    //   if (err) throw err

    //   // success case, the file was saved
    //   console.log('Lyric saved!')
    // })
    const file = ctx.request.files.file
    console.log(ctx.request.body)
    console.log(file)
    const reader = fs.createReadStream(file.path)
    let filePath = path.resolve('public/upload') + `/${ctx.request.body.fileName}`
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
  })

module.exports = router
