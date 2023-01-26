const { sequelize, TvShows } = require('../models/')
const multer = require('multer')
const path = require('path')
const Joi = require('joi')

const valSchema = Joi.object({
    title: Joi.string().max(50).required(),
    genre: Joi.string().max(15).required(),
    episodes: Joi.number().integer().required(),
    rating: Joi.number().integer().required(),
    image: Joi.string().max(500),
    id: Joi.number().integer()
})

//GET AllBooks
const getAll = async (req, res) => {
    
    TvShows.findAll()
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
        title: req.body.title, 
        rating: req.body.rating, 
        genre: req.body.genre,
        episodes: req.body.episodes,
        
    }
    TvShows.create(info)
        .then( rows => res.json(rows))
        .catch( err => res.status(500).json(err))
    
    
}

//GET one book
const getOne = async (req, res) => {
    TvShows.findOne({where: { id: req.params.id}})
        .then( rows => res.json(rows))
        .catch( err => res.status(500).json(err))
}

//DELETE a book

const deleteOne = async (req, res) => {
    let id = req.params.id
    await TvShows.destroy({ where: { id: id }} )
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
    const elem = await TvShows.update(req.body, { where: { id: id }})
    res.status(200).send(elem)
}


//Upload Image Controller

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'images/tvshows_images')
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