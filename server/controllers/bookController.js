const uuid = require('uuid')
const path = require('path')
const {Book, BookshelfBook} = require('../models/models')
const ApiError = require('../error/ApiError')
const fs = require('fs')

class BookController {
    async create(req, res, next) {
        // res.json("Создание книги")
        try {
            const {name, author, price, genre, description, link, userId} = req.body
            const {img} = req.files
            const {file} = req.files
            let fileNameImg = uuid.v4() + ".jpg"
            let fileNameFile = uuid.v4() + ".pdf"
            img.mv(path.resolve(__dirname, '..', 'static', fileNameImg))
            file.mv(path.resolve(__dirname, '..', 'static', fileNameFile))

            const book = await Book.create({name, author, price, genre, description, link, userId, img: fileNameImg, file: fileNameFile})
        
            return res.json(book)
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
        
    }

    async getAll(req, res) {
        // res.json("Просмотр всех книг")
        let {limit, page} = req.query
        page = page || 1
        limit = limit || 9
        let offset = page * limit - limit

        let books;
        books = await Book.findAndCountAll({limit, offset})
        
        return res.json(books)
    }
    
    async getOne(req, res) {
        // res.json("Просмотр конкректной книги")
        const {id} = req.params
        const book = await Book.findOne(
            {
                where: {id}
            }
        )
        return res.json(book)
    }

    async delete(req, res, next) {
        const { id } = req.params

        try {
            // Удаление всех строк из BookshelfBook, где есть id этой книги
            await BookshelfBook.destroy({ where: { bookId: id } })

            // Удаление книги
            const book = await Book.findOne({ where: { id } })
            if (!book) {
                return next(ApiError.badRequest('Книга не найдена'))
            }

            // Удаление файлов изображения и книги из файловой системы
            const imgPath = path.resolve(__dirname, '..', 'static', book.img)
            const filePath = path.resolve(__dirname, '..', 'static', book.file)

            fs.unlink(imgPath, (err) => {
                if (err) {
                    console.error(`Ошибка при удалении файла изображения: ${err.message}`)
                }
            })
            fs.unlink(filePath, (err) => {
                if (err) {
                    console.error(`Ошибка при удалении файла книги: ${err.message}`)
                }
            })

            await book.destroy()
            return res.json({ message: 'Книга успешно удалена' })
        } catch (e) {
            next(ApiError.internal(e.message))
        }
    }
}

module.exports = new BookController()