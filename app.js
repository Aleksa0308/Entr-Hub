const express = require('express')
const path = require('path')
const { sequelize } = require('./models')
const jwt = require('jsonwebtoken');
const cors = require('cors');
require('dotenv').config();
const Joi = require('joi');
const { Users } = require('./models');
const bcrypt = require('bcrypt');
const history = require('connect-history-api-fallback');
const bodyParser = require('body-parser')

const app = express()

var corsOptions = {
    origin: '*',
    optionsSuccessStatus: 200
}

function getCookies(req) {
    if (req.headers.cookie == null) return {};

    const rawCookies = req.headers.cookie.split('; ');
    const parsedCookies = {};

    rawCookies.forEach( rawCookie => {
        const parsedCookie = rawCookie.split('=');
        parsedCookies[parsedCookie[0]] = parsedCookie[1];
    });

    return parsedCookies;
};

function authToken(req, res, next) {
    const cookies = getCookies(req);
    const token = cookies['token'];
  
    if (token == null) return res.redirect(302, '/login');
    
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    
        if (err) return res.redirect(302, '/login');
    
        req.username = user;
    
        next();
    });
}

function authAdmin(req, res, next) {
    const cookies = getCookies(req);
    const token = cookies['token'];
  
    if (token == null) return res.redirect(302, '/login');
    
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    
        if (err) return res.redirect(302, '/login');
    
        if(user.role == 'admin'){
            req.username = user;
            next();
        }else{
            res.redirect(302, '/')
        }
        
    });
}

app.use(cors(corsOptions))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))



app.use('/images', express.static('./images'))


const booksRouter = require('./routes/books')
const usersRouter = require('./routes/users')
const moviesRouter = require('./routes/movies')
const gamesRouter = require('./routes/games')
const animeRouter = require('./routes/anime')
const tvshowsRouter = require('./routes/tvshows')
const comicbooksRouter = require('./routes/comicbooks')
const mangaRouter = require('./routes/manga')
const discussRouter = require('./routes/discuss')
const commentsRouter = require('./routes/comments')


app.use('/api/users', usersRouter);
app.use('/api/books', booksRouter);
app.use('/api/movies', moviesRouter);
app.use('/api/games', gamesRouter);
app.use('/api/anime', animeRouter);
app.use('/api/tvshows', tvshowsRouter);
app.use('/api/comicbooks', comicbooksRouter);
app.use('/api/manga', mangaRouter);
app.use('/api/discuss', discussRouter);
app.use('/api/comments', commentsRouter);


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


app.post('/api_register', (req, res) => {
    const {error, value} = registerSchema.validate(req.body);
    if(error){
        console.log(error);
        return res.send(error)
    }
    const obj = {
        username: req.body.username,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, 10),
        role: 'admin'
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

app.post('/api_login', (req, res) => {
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



const staticMdl = express.static(path.join(__dirname, 'dist'));

app.use(staticMdl);

app.use(history({ index: '/index.html' }));

app.use(staticMdl);


app.listen({port: process.env.PORT || 8000}, async ()=>{
    await sequelize.authenticate()
})

