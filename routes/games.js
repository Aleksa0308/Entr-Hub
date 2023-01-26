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
    upload,
} = require('../controllers/games.js')

router.route('/').get(getAll)
router.route('/:id').get(getOne)
router.route('/').post(authAdmin, upload ,addOne)
router.route('/:id').delete(authAdmin, deleteOne)
router.route('/:id').put(authAdmin,updateOne)


module.exports = router