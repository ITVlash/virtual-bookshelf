const { Bookshelf, Book, BookshelfBook, User } = require('../models/models')
const ApiError = require('../error/ApiError')

class BookshelfController {
    async getBookshelfByBookshelfId(req, res) {
        try {
            const { bookshelfId } = req.params;
            // const userId = req.user.id;
            // return res.status(404).json({ message: userId });
            const bookshelf = await Bookshelf.findOne({
                where: { id: bookshelfId },
                include: [{
                    model: BookshelfBook,
                    include: [Book]
                }]
            });

            if (!bookshelf) {
                return res.status(404).json({ message: "Bookshelf not found" });
            }

            return res.json(bookshelf);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Server error" });
        }
    }
}

module.exports = new BookshelfController();
