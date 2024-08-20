const Router = require('express')
const router = new Router()
const bookController = require('../controllers/bookController')
const checkRole = require('../middleware/checkRoleMiddleware')

router.post('/', checkRole(['ADMIN', 'AUTHOR']), bookController.create)
router.delete('/:id', checkRole(['ADMIN', 'AUTHOR']), bookController.delete)
router.get('/', bookController.getAll)
router.get('/:id', bookController.getOne)

module.exports = router
