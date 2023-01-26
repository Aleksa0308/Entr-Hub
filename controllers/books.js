const { sequelize, Books } = require('../models/')
const multer = require('multer')
const path = require('path')
const Joi = require('joi')


const booksSchema = Joi.object({
    title: Joi.string().max(50).required(),
    author: Joi.string().max(20).required(),
    genre: Joi.string().max(15).required(),
    desc: Joi.string().max(200).required(),
    image: Joi.string().max(500),
    id: Joi.number().integer()
})

//GET AllBooks
const getAllBooks = async (req, res) => {
    Books.findAll()
        .then( rows => res.json(rows))
        .catch( err => res.status(500).json(err))
}

//POST one book
const addBook = async(req, res) => {


    const { error, value } = booksSchema.validate(req.body);
    if(error){
        console.log(error);
        return res.send(error)
    }
     
   console.log(req.file);


    let info = {
        
        title: req.body.title, 
        author: req.body.author, 
        genre: req.body.genre,
        desc: req.body.desc,
        image: req.file.path
    }
    Books.create(info)
        .then( rows => res.json(rows))
        .catch( err => res.status(500).json(err))
    
    
}

//GET one book
const getBook = async (req, res) => {
    Books.findOne({where: { id: req.params.id}})
        .then( rows => res.json(rows))
        .catch( err => res.status(500).json(err))
}

//DELETE a book

const deleteBook = async (req, res) => {
    let id = req.params.id
    await Books.destroy({ where: { id: id }} )
    res.status(200).send('Book is deleted !')
}

//UPDATE Book

const updateBook = async (req, res) => {
    console.log(req);
    const { error, value } = booksSchema.validate(req.body);
    if(error){
        console.log(error);
        return res.send(error)
    }
    
    let id = req.params.id
    const book = await Books.update(req.body, { where: { id: id }})
    res.status(200).send(book)
}


//Upload Image Controller

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'images/book_images')
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname))
    }
})

const upload = multer({
    storage: storage,
    limits: { fileSize: '1000000' },
    fileFilter: (req, file, cb) => {
        const fileTypes = /jpeg|jpg|png|gif/
        const mimeType = fileTypes.test(file.mimetype)  
        const extname = fileTypes.test(path.extname(file.originalname))

        if(mimeType && extname) {
            return cb(null, true)
        }
        cb('Give proper files formate to upload')
    }
}).single('image')


module.exports = {
    getAllBooks,
    addBook,
    getBook,
    deleteBook,
    updateBook,
    upload,

}