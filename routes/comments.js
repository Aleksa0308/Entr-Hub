const express = require('express')
const router = express.Router()


const {
    authAdmin,
    authToken
} = require('../middleware/authenticate')


const {
    getAll,
    addOne,
    getOne,
    deleteOne,
    updateOne,
    
} = require('../controllers/comments.js')

router.route('/:id').get(getAll)
router.route('/:id').post(authToken, addOne)
router.route('/:id').delete(authAdmin, deleteOne)
router.route('/:id').put(authAdmin, updateOne)


module.exports = router