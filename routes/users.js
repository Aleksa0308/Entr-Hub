const express = require('express')
const router = express.Router()
const booksController = require('../controllers/users')

const {
    authAdmin,
    authToken
} = require('../middleware/authenticate')


const {
    getAllUsers,
    addUser,
    getUser,
    deleteUser,
    updateUser,
} = require('../controllers/users.js')

router.route('/').get(authAdmin, getAllUsers)
router.route('/:id').get(authAdmin, getUser)
router.route('/').post(authAdmin, addUser)
router.route('/:id').delete(authAdmin, deleteUser)
router.route('/:id').put(authAdmin, updateUser)



module.exports = router