const { sequelize, Books, Users } = require('../models/')
const bcrypt = require('bcrypt');
const path = require('path')
const Joi = require('joi')

const valSchema = Joi.object({
    username: Joi.string().max(50).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(3).required(),
    role: Joi.string().max(5).required(),
    id: Joi.number().integer()
})
const valUpdate = Joi.object({
    username: Joi.string().max(50).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(3),
    role: Joi.string().max(5).required(),
    id: Joi.number().integer()
})


//GET AllBooks
const getAllUsers = async (req, res) => {
    Users.findAll()
        .then( rows => res.json(rows))
        .catch( err => res.status(500).json(err))
}

//POST one book
const addUser = async(req, res) => {

    const { error, value } = valSchema.validate(req.body);
    if(error){
        console.log(error);
        return res.send(error)
    }

    const obj = {
        username: req.body.username,
        email: req.body.email,
        role: req.body.role,
        password: bcrypt.hashSync(req.body.password, 10)
    };

    Users.create(obj).then( rows => res.json(rows))
        .catch( err => res.status(500).json(err))
    
    
}

//GET one book
const getUser = async (req, res) => {
    Users.findOne({where: { id: req.params.id}})
        .then( rows => res.json(rows))
        .catch( err => res.status(500).json(err))
}

//DELETE a book

const deleteUser = async (req, res) => {
    let id = req.params.id
    await Users.destroy({ where: { id: id }} )
    res.status(200).send('User is deleted !')
}

//UPDATE Book

const updateUser = async (req, res) => {

    const { error, value } = valUpdate.validate(req.body);
    if(error){
        console.log(error);
        return res.send(error)
    }

    let id = req.params.id
    if(!(req.body.password === '')){
        req.body.password =  bcrypt.hashSync(req.body.password, 10)
    }
    const user = await Users.update(req.body, { where: { id: id }})
    res.status(200).send(user)
}


module.exports = {
    getAllUsers,
    addUser,
    getUser,
    deleteUser,
    updateUser,

}