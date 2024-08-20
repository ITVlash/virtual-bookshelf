const {Book, Bookshelf, BookshelfBook} = require('../models/models')
const ApiError = require('../error/ApiError')

class BookshelfBookController {
    async addBookInBookshelf(req, res, next) { // Добавление книги в книжную полку
        const {bookshelfId, bookId} = req.body

        // Проверка существования книжной полки
        const bookshelf_existence = await Bookshelf.findOne({ where: { id: bookshelfId } });
        if (!bookshelf_existence) {
            return next(ApiError.badRequest('Книжная полка не существует'));
        }

        // Проверка существования книги
        const book_existence = await Book.findOne({ where: { id: bookId } });
        if (!book_existence) {
            return next(ApiError.badRequest('Книга не существует'));
        }

        // Проверка: есть пара книжная_полка - книга в базе данных
        const candidate = await BookshelfBook.findOne({where: {bookshelfId, bookId}})
        if (candidate) {
            return next(ApiError.badRequest('Эта книга уже добавлена в соответствующую книжную полку'))
        }

        // Если все проверки пройдены, добавляем пару
        const bookshelfBook = await BookshelfBook.create({bookshelfId, bookId})
        return res.json(bookshelfBook)
    }

    async removeBookFromBookshelf(req, res, next) { // Удаление книги из книжной полки
        const { bookshelfId, bookId } = req.body;

        // Проверка существования книги в книжной полке
        const bookshelfBook = await BookshelfBook.findOne({ where: { bookshelfId, bookId } });
        if (!bookshelfBook) {
            return next(ApiError.badRequest('Эта книга не найдена в указанной книжной полке'));
        }

        // Проверка прав пользователя
        if (req.user.role !== 'ADMIN' && req.user.id !== bookshelfId) {
            return next(ApiError.forbidden('Доступ запрещен'));
        }

        // Удаление книги из книжной полки
        await bookshelfBook.destroy();
        return res.json({ message: 'Книга удалена из книжной полки' });
    }
}

module.exports = new BookshelfBookController