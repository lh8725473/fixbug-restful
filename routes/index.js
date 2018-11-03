const router = require('koa-router')()
const nodemailer = require('nodemailer')

// router.get('/', async (ctx, next) => {
//   await ctx.render('index', {
//     title: 'Hello Koa 2!'
//   })
// })

router.get('/sendEmail', async (ctx, next) => {
  let transporter = nodemailer.createTransport({
    // host: 'smtp.qq.com',
    service: 'qq', // 使用了内置传输发送邮件 查看支持列表：https://nodemailer.com/smtp/well-known/
    port: 465, // SMTP 端口
    secureConnection: true, // 使用了 SSL
    auth: {
      user: '171213574@qq.com',
      // 这里密码不是qq密码，是你设置的smtp授权码
      pass: '123456'
    }
  })

  let mailOptions = {
    from: '"JavaScript之禅" <171213574@qq.com>', // sender address
    to: 'chenzhihao@mixislink.com', // list of receivers
    subject: 'Hello', // Subject line
    // 发送text或者html格式
    // text: 'Hello world?', // plain text body
    html: '<b>Hello world?</b>' // html body
  }

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.log(error)
    }
    console.log('Message sent: %s', info.messageId)
    // Message sent: <04ec7731-cc68-1ef6-303c-61b0f796b78f@qq.com>
  })
  ctx.body = 'koa2 string'
})

router.get('/string', async (ctx, next) => {
  ctx.body = 'koa2 string'
})

router.get('/json', async (ctx, next) => {
  try {
    console.log('dsadsa')
  } catch (error) {
    console.log('error')
    console.log(error.message)
    console.log(error)
    ctx.body = {
      title: error.message
    }
    ctx.app.emit('error', error, ctx)
  }
})

module.exports = router
