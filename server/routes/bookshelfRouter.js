const Router = require('express')
const router = new Router()
const bookshelfController = require('../controllers/bookshelfController')
const bookshelfBookController = require('../controllers/bookshelfBookController')
const checkRoleAndAuth = require('../middleware/checkRoleAndAuthMiddleware.js')

router.post('/', checkRoleAndAuth, bookshelfBookController.addBookInBookshelf)
router.delete('/', checkRoleAndAuth, bookshelfBookController.removeBookFromBookshelf)
router.get('/:bookshelfId', checkRoleAndAuth, bookshelfController.getBookshelfByBookshelfId)

module.exports = router