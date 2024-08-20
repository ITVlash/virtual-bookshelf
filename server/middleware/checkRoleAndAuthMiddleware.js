const jwt = require('jsonwebtoken');
const { User, Bookshelf } = require('../models/models');

module.exports = async function (req, res, next) {
    if (req.method === "OPTIONS") {
        return next();
    }
    try {
        const token = req.headers.authorization.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: "Не авторизован" });
        }
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        req.user = decoded;

        const user = await User.findByPk(decoded.id);

        if (!user) {
            return res.status(401).json({ message: "Пользователь не найден" });
        }

        if (user.role === 'ADMIN') {
            return next(); // Если пользователь админ, пропускаем его
        }

        let bookshelfId;
        if (req.method === "GET") {
            bookshelfId = req.params.bookshelfId;
        } else if (req.method === "POST" || req.method === "DELETE") {
            bookshelfId = req.body.bookshelfId;
        }

        if (!bookshelfId || parseInt(bookshelfId, 10) !== user.id) {
            return res.status(403).json({ message: "Доступ запрещен" });
        }

        return next(); // Если bookshelfId соответствует user.id, пропускаем пользователя
    } catch (e) {
        return res.status(401).json({ message: "Не авторизован" });
    }
};

