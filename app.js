const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const path = require('path')
const passport = require('passport')
const rIndex = require('./routers/index')
const rAdd = require('./routers/add')
const rUser = require('./routers/user')
const expressValidator = require('express-validator')
const session = require('express-session')
const app = express() 

/// Setting Validators

app.use(require('connect-flash')())
app.use(function (req,res , next) {
    res.locals.messages = require('express-messages')(req , res)
    next()
})
app.use(session({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true
  }))

/// Express Validator

app.use(expressValidator({
    errorFormatter : (param ,msg , value) => {
        let namespace = param.split('.')
            root  = namespace.shift()
            formParam = root

        while(namespace.length){
            formParam += '[' + namespace.shift() + ']' 
        }
        return {
            param: formParam,
            msg:msg,
            value: value
        }
    }

}))


///  Setting mongoose
const database = require('./helper/db')
mongoose.connect(database.db, {useNewUrlParser: true, useUnifiedTopology: true , useCreateIndex: true});

const db = mongoose.connection

db.on('open' , () => {
    console.log( ('MongoDb running'))
})

db.on('error' , (err) => {
    console.log( ('MongoDb error running'))
})


/// Setting Engine

app.set('view engine'  , 'pug')
app.set('views' , path.join(__dirname , 'views'))


/// Setting BodyParser

app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())

/// Setting static folder

app.use(express.static(path.join(__dirname , 'public')))
app.use(express.static(path.join(__dirname )))
 
require('./md/passport')(passport)
app.use(passport.initialize())
app.use(passport.session())


app.get("*" , (req, res , next) => {
    res.locals.user = req.user || null
    next()
})


app.use(rIndex)
app.use(rAdd)
app.use(rUser)


app.listen(3000 , () => {
    console.log('server 3000 portda ishladi')
})