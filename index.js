const Koa = require('koa');
const path = require('path')
const serve = require('koa-static')
const views = require('koa-views')
const session = require('koa-session')
const bodyParser = require('koa-bodyparser')
const mongoose = require('mongoose')
const marked = require('marked')
const flash = require('./middlewares/flash')
const router = require('./routes')
const CONFIG = require('./config/config')

marked.setOptions({
  renderer: new marked.Renderer(),
  gfm: true,
  tables: true,
  breaks: false,
  pedantic: false,
  sanitize: true,
  smartLists: true,
  smartypants: false
})

const app = module.exports = new Koa();

// router(app)
mongoose.connect(CONFIG.mongodb)

app.keys = ['blog']

app.use(session({
  key: CONFIG.session.key,
  maxAge: CONFIG.session.maxAge
}, app))

app.use(flash())

app.use(serve(
  path.resolve(__dirname, './assets')
))

app.use(views(path.join(__dirname, 'views'), {
  map: {html: 'nunjucks'}
}))

app.use(async (ctx, next) => {
  ctx.state.ctx = ctx
  ctx.state.marked = marked
  await next()
})

app.use(bodyParser())
router(app)


if (!module.parent) app.listen(CONFIG.port)
console.log(`server is running at http://localhost:${CONFIG.port}`)

// app.listen(4000, () => {
//   console.log('server is running at http://localhost:4000')
// })
