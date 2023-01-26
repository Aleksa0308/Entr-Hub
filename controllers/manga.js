const { sequelize, manga } = require('../models/')
const multer = require('multer')
const path = require('path')
const Joi = require('joi')

const valSchema = Joi.object({
    name: Joi.string().max(50).required(),
    author: Joi.string().max(15).required(),
    theme: Joi.string().max(50).required(),
    status: Joi.string().max(10).required(),
    image: Joi.string().max(500),
    id: Joi.number().integer()
})

//GET AllBooks
const getAll = async (req, res) => {
    
    manga.findAll()
        .then( rows => res.json(rows))
        .catch( err => res.status(500).json(err))
}

//POST one book
const addOne = async(req, res) => {

    
    const { error, value } = valSchema.validate(req.body);
    if(error){
        console.log(error);
        return res.send(error)
    }
    

    let info = {
        image: req.file.path,
        name: req.body.name, 
        author: req.body.author, 
        status: req.body.status,
        theme: req.body.theme,
        
    }
    manga.create(info)
        .then( rows => res.json(rows))
        .catch( err => res.status(500).json(err))
    
    
}

//GET one book
const getOne = async (req, res) => {
    manga.findOne({where: { id: req.params.id}})
        .then( rows => res.json(rows))
        .catch( err => res.status(500).json(err))
}

//DELETE a book

const deleteOne = async (req, res) => {
    let id = req.params.id
    await manga.destroy({ where: { id: id }} )
    res.status(200).send('Book is deleted !')
}

//UPDATE Book

const updateOne = async (req, res) => {

    
    const { error, value } = valSchema.validate(req.body);
    if(error){
        console.log(error);
        return res.send(error)
    }
    

    let id = req.params.id
    const elem = await manga.update(req.body, { where: { id: id }})
    res.status(200).send(elem)
}


//Upload Image Controller

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'images/manga_images')
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
    getAll,
    addOne,
    getOne,
    deleteOne,
    updateOne,
    upload,

}