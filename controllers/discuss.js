const { sequelize, discuss } = require('../models/')
const multer = require('multer')
const path = require('path')
const Joi = require('joi')

const valSchema = Joi.object({
    title: Joi.string().max(50).required(),
    category: Joi.string().max(15).required(),
    content: Joi.string().max(150).required(),
    author: Joi.string().max(25).required(),
    id: Joi.number().integer()
})

//GET AllBooks
const getAll = async (req, res) => {
    
    discuss.findAll()
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
        title: req.body.title, 
        author: req.body.author, 
        category: req.body.category,
        content: req.body.content,
        
    }
    discuss.create(info)
        .then( rows => res.json(rows))
        .catch( err => res.status(500).json(err))
    
    
}

//GET one book
const getOne = async (req, res) => {
    discuss.findOne({where: { id: req.params.id}})
        .then( rows => res.json(rows))
        .catch( err => res.status(500).json(err))
}

//DELETE a book

const deleteOne = async (req, res) => {
    let id = req.params.id
    await discuss.destroy({ where: { id: id }} )
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
    const elem = await discuss.update(req.body, { where: { id: id }})
    res.status(200).send(elem)
}




module.exports = {
    getAll,
    addOne,
    getOne,
    deleteOne,
    updateOne,
    

}