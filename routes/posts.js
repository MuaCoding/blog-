const PostModel = require('../models/post')
const CommentModel = require('../models/comment')
const CategoryModel = require('../models/category')

module.exports = {
  async index(ctx, next) {
    const pageSize = 15
    const currentPage = parseInt(ctx.query.page) || 1

    // 分类名
    const cname = ctx.query.c
    let cid
    if (cname) {
      // 查询分类id
      const cateogry = await CategoryModel.findOne({ name: cname })
      cid = cateogry._id
    }
    // 根据是否有分类来控制查询语句
    const query = cid ? { category: cid } : {}

    const allPostsCount = await PostModel.count()
    const pageCount = Math.ceil(allPostsCount / pageSize)
    const pageStart = currentPage - 2 > 0 ? currentPage - 2 : 1
    const pageEnd = pageStart + 4 >= pageCount ? pageCount : pageStart + 4
    const posts = await PostModel.find({}).skip((currentPage - 1) * pageSize).limit(pageSize)
    const baseUrl = cname ? `${ctx.path}?c=${cname}&page=` : `${ctx.path}?page=`

    await ctx.render('index', {
      title: 'JS',
      posts,
      pageSize,
      currentPage,
      allPostsCount,
      pageCount,
      pageStart,
      pageEnd,
      baseUrl
    })
  },

  //创建文章
  async create(ctx, next) {
    if (ctx.method === 'GET') {
      await ctx.render('create', {
        title: '新建文章',
      })
      return
    }

    const post = Object.assign(ctx.request.body, {
      author: ctx.session.user._id
    })
    const {title, content} = ctx.request.body
    let errMsg = ''
    if (title === '') {
      errMsg = '标题不能是空的'
    } else if (content === '') {
      errMsg = '内容不可为空'
    }
    const res = await PostModel.create(post)

    ctx.flash = {success: '发表文章成功'}
    ctx.redirect(`/posts/${res._id}`)
  },

  // 展示文章详情
  async show(ctx, next) {
    const postId = ctx.params.id
    if (postId.length !== 24) {
      ctx.throw(404, '此主题不存在或已被删除')
    }

    const post = await PostModel.findById(postId).populate([
      {path: 'author', select: 'name'},
      // { path: 'category', select: ['title', 'name'] }
    ])
    console.info(post)
    // if (!post) {
    //   ctx.throw(404, '此主题不存在或已被删除')
    // }
    //查找评论
    const comments = await CommentModel.find({postId: ctx.params.id})
      .populate({path: 'from', select: 'name'})

    await ctx.render('post', {
      title: post.title,
      post,
      comments
    })
  },

  //  编辑文章
  async edit(ctx, next) {
    const postId = ctx.params.id

    if (ctx.method === 'GET') {
      const post = await PostModel.findById(postId)
      if (!post) {
        throw new Error('文章不存在')
      }
      if (post.author.toString() !== ctx.session.user._id.toString()) {
        throw new Error('没有权限')
      }
      await ctx.render('edit', {
        title: '更新文章',
        post
      })
      return
    }
    const {title, content} = ctx.request.body
    await PostModel.findByIdAndUpdate(postId, {
      title,
      content
    })
    ctx.flash = {success: '更新文章成功'}
    ctx.redirect(`/posts/${postId}`)
  },

  // 删除文章
  async delete(ctx, next) {
    const postId = ctx.params.id
    const post = await PostModel.findById(postId)

    if (!post) {
      throw new Error('文章不存在')
    }
    if (post.author.toString() !== ctx.session.user._id.toString()) {
      throw new Error('没有权限')
    }
    await PostModel.findByIdAndRemove(postId)
    ctx.flash = {success: '删除文章成功'}
    ctx.redirect('/')
  }
}
