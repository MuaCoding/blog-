const router = require('koa-router')()

//判断是否登录
async function isLoginUser(ctx, next) {
  if (!ctx.session.user) {
    ctx.flash = {warning: '未登录, 请先登录'}
    return ctx.redirect('/signin')
  }
  await next()
}

//判断是否有权限登录
async function isAdmin(ctx, next) {
  if (!ctx.session.user) {
    ctx.flash = {warning: '未登录, 请先登录'}
  }
  if (!ctx.session.user.isAdmin) {
    ctx.flash = {warning: '没有权限'}
  }
  await next()
}


module.exports = (app) => {
  // router.get('/', require('./posts').index)
  router.get('/', require('./home').index)
  // router.get('/about', require('./about').index)

  // router.get('/signup', require('./user').signup)
  // router.post('/signup', require('./user').signup)
  // router.get('/signin', require('./user').signin)
  // router.post('/signin', require('./user').signin)

  app
    .use(router.routes())
    .use(router.allowedMethods())

  // 404
  app.use(async (ctx, next) => {
    await ctx.render('404', {
      title: 'page not find'
    })
  })
}
