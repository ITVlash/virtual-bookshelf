const sequelize = require('../db')
const {DataTypes} = require('sequelize')

const User = sequelize.define('user', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    email: {type: DataTypes.STRING, unique: true},
    login: {type: DataTypes.STRING, unique: true},
    password: {type: DataTypes.STRING},
    role: {type: DataTypes.STRING, defaultValue: "USER"},
    name: {type: DataTypes.STRING, defaultValue: "Аноним"},
    user_balance: {type: DataTypes.FLOAT, defaultValue: 0.00},
    author_balance: {type: DataTypes.FLOAT, defaultValue: 0.00},
    status: {type: DataTypes.STRING, defaultValue: " "}
})

const Bookshelf = sequelize.define('bookshelf', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true}
})

const BookshelfBook = sequelize.define('bookshelf_book', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true}
})

const Book = sequelize.define('book', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name: {type: DataTypes.STRING, unique: true, allowNull: false},
    author: {type: DataTypes.STRING, defaultValue: " "},
    price: {type: DataTypes.FLOAT, defaultValue: 0.00},
    genre: {type: DataTypes.STRING, defaultValue: " "},
    description: {type: DataTypes.STRING, defaultValue: " "},
    img: {type: DataTypes.STRING, allowNull: false},
    link: {type: DataTypes.STRING, allowNull: false},
    file: {type: DataTypes.STRING, allowNull: false}
})

User.hasOne(Bookshelf)
Bookshelf.belongsTo(User)

User.hasMany(Book)
Book.belongsTo(User)

Bookshelf.hasMany(BookshelfBook)
BookshelfBook.belongsTo(Bookshelf)

Book.hasOne(BookshelfBook)
BookshelfBook.belongsTo(Book)

module.exports = {
    User, Bookshelf, Book, BookshelfBook
}