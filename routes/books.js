const express = require('express')
const router = express.Router()
const booksController = require('../controllers/books.js')

router.use(express.json());
router.use(express.urlencoded({ extended: true }));

const {
    authAdmin,
    authToken
} = require('../middleware/authenticate')

const {
    getAllBooks,
    addBook,
    getBook,
    deleteBook,
    updateBook,
    upload,
} = require('../controllers/books.js')


router.route('/').get(getAllBooks)
router.route('/:id').get(getBook)
router.route('/').post(authAdmin ,upload ,addBook)
router.route('/:id').delete(authAdmin ,deleteBook)
router.route('/:id').put(authAdmin, updateBook)


module.exports = router