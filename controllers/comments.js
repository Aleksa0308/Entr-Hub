const { sequelize, Comments, discuss } = require('../models/')
const multer = require('multer')
const path = require('path')
const Joi = require('joi')

const valSchema = Joi.object({
    title: Joi.string().max(50).required(),
    genre: Joi.string().max(15).required(),
    desc: Joi.string().max(150).required(),
    rating: Joi.number().integer().required(),
    
})

//GET AllBooks
const getAll = async (req, res) => {
    
    Comments.findAll({ where: { userId: req.params.id } })
        .then( rows => res.json(rows))
        .catch( err => res.status(500).json(err))
}

//POST one book
const addOne = async(req, res) => {

    /*
    const { error, value } = valSchema.validate(req.body);
    if(error){
        console.log(error);
        return res.send(error)
    }
    */

     discuss.findOne({ where: { id: req.params.id } })
        .then( usr => {
                Comments.create({ author: req.body.author, userId: req.params.id, content: req.body.content })
                    .then( rows => res.json(rows) )
                    .catch( err => res.status(500).json(err) );
        })
        .catch( err => res.status(500).json(err))
    
}

//GET one book
const getOne = async (req, res) => {
    Comments.findOne({where: { userId: req.params.id}})
        .then( rows => res.json(rows))
        .catch( err => res.status(500).json(err))
}

//DELETE a book

const deleteOne = async (req, res) => {
    let id = req.params.id
    await Comments.destroy({ where: { id: id }} )
    res.status(200).send('Book is deleted !')
}

//UPDATE Book

const updateOne = async (req, res) => {

    /*
    const { error, value } = valSchema.validate(req.body);
    if(error){
        console.log(error);
        return res.send(error)
    }
    */

    let id = req.params.id
    const elem = await Comments.update(req.body, { where: { id: id }})
    res.status(200).send(elem)
}




module.exports = {
    getAll,
    addOne,
    getOne,
    deleteOne,
    updateOne,
   

}