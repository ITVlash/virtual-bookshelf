const Router = require('express')
const router = new Router()
const userRouter = require('./userRouter')
const bookRouter = require('./bookRouter')
const bookshelfRouter = require('./bookshelfRouter')

router.use('/user', userRouter)
router.use('/book', bookRouter)
router.use('/bookshelf', bookshelfRouter)

module.exports = router