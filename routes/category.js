const CategoryModel = require('../models/category')

module.exports = {
  //获取分类列表
  async list(ctx, next) {
    const categories = await CategoryModel.find({})
    await ctx.render('category', {
      title: '分类管理',
      categories
    })
  },
  //创建分类
  async create(ctx, next) {
    if (ctx.method === 'GET') {
      await ctx.render('create_category', {
        title: '新建分类'
      })
      return
    }
    const { name, title } = ctx.request.body
    let errMsg = ''
    if (name === '') {
      errMsg = '分类名不能为空'
    } else if (title === '') {
      errMsg = '分类标题不能为空'
    }
    if (errMsg) {
      ctx.flash = { warning: errMsg }
      ctx.redirect('back')
      return
    }
    await CategoryModel.create(ctx.request.body)
    ctx.redirect('/category')
  },

  //删除分类
  async delete(ctx,next){
    await CategoryModel.findByIdAndRemove(ctx.params.id)
    ctx.flash = { success: '删除分类成功' }
    ctx.redirect('/category')
  }
}
