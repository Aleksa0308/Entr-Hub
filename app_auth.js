const express = require('express');
const { sequelize, Users } = require('./models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const Joi = require('joi');
require('dotenv').config();

const app = express();

var corsOptions = {
    origin: '*',
    optionsSuccessStatus: 200
}

app.use(express.json());
app.use(cors(corsOptions));

const registerSchema = Joi.object({
    username: Joi.string().min(3).max(15).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(3).required(),
    //role: Joi.string().min(3).required()
})
const loginSchema = Joi.object({
    username: Joi.string().min(3).max(15).required(),
    password: Joi.string().min(3).required(),
})


app.post('/register', (req, res) => {
    const {error, value} = registerSchema.validate(req.body);
    if(error){
        console.log(error);
        return res.send(error)
    }
    const obj = {
        username: req.body.username,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, 10),
        role: req.body.role
    };

    Users.create(obj).then( rows => {
        
        const usr = {
            userId: rows.id,
            user: rows.username,
            role: rows.role
        };

        const token = jwt.sign(usr, process.env.ACCESS_TOKEN_SECRET);

        console.log(token);
        
        res.json({ token: token });

    }).catch( err => res.status(500).json(err) );
});

app.post('/login', (req, res) => {
    const {error, value} = loginSchema.validate(req.body);
    if(error){
        console.log(error);
        return res.send(error)
    }

    Users.findOne({ where: { username: req.body.username } })
        .then( usr => {

            if (bcrypt.compareSync(req.body.password, usr.password)) {
                const obj = {
                    userId: usr.id,
                    user: usr.username,
                    role: usr.role
                };
        
                const token = jwt.sign(obj, process.env.ACCESS_TOKEN_SECRET);
                
                res.json({ token: token });
            } else {
                res.status(400).json({ msg: "Invalid credentials"});
            }
        })
        .catch( err => res.status(500).json(err) );
});

app.listen({ port: 9000 }, async () => {
    await sequelize.authenticate();
});