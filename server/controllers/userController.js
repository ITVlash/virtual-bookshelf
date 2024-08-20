const ApiError = require('../error/ApiError')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const {User, Bookshelf, BookshelfBook, Book} = require('../models/models')

const generateJwt = (id, email, role) => {
    return jwt.sign(
        {id, email, role},
        process.env.SECRET_KEY,
        {expiresIn: '24h'}
    )
}

class UserController {
    async registration(req, res, next) { // Регистрация пользователя
        const {email, password, role} = req.body
        if (!email || !password) {
            return next(ApiError.badRequest('Некорректная почта или пароль'))
        }
        const candidate = await User.findOne({where: {email}})
        if (candidate) {
            return next(ApiError.badRequest('Пользователь с таким email уже существует'))
        }
        const hashPassword = await bcrypt.hash(password, 5)
        const user = await User.create({email, role, password: hashPassword})
        const bookshelf = await Bookshelf.create({userId: user.id})
        const token = generateJwt(user.id, user.email, user.role)
        return res.json({token})
    }

    async login(req, res, next) { // Вход поользователя
        const {email, password} = req.body
        const user = await User.findOne({where: {email}})
        if (!user) {
            return next(ApiError.internal('Пользователь не найден'))
        }
        let comparePassword = bcrypt.compareSync(password, user.password)
        if (!comparePassword) {
            return next(ApiError.internal('Указан неверный пароль'))
        }
        const token = generateJwt(user.id, user.email, user.role)
        return res.json({token})
    }

    async check(req, res, next) {
        const token = generateJwt(req.user.id, req.user.email, req.user.role)
        let id = req.user.id
        let email = req.user.email
        let role = req.user.role
        return res.json({token, id, email, role})
    }

    async delete(req, res, next) {
        const {id} = req.params

        try {
            // Поиск пользователя
            const user = await User.findOne({ where: { id } })
            if (!user) {
                return next(ApiError.badRequest('Пользователь не найден'))
            }

            // Удаление всех строк из BookshelfBook, где есть id книжной полки этого пользователя
            const bookshelf = await Bookshelf.findOne({ where: { userId: id } })
            if (bookshelf) {
                await BookshelfBook.destroy({ where: { bookshelfId: bookshelf.id } })
                // Удаление книжной полки пользователя
                await bookshelf.destroy()
            }

            // Удаление всех книг пользователя
            await Book.destroy({ where: { userId: id } })

            // Удаление самого пользователя
            await user.destroy()
            return res.json({ message: 'Пользователь успешно удален' })
        } catch (e) {
            next(ApiError.internal(e.message))
        }
    }
}

module.exports = new UserController()