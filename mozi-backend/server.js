require('dotenv').config()

const express = require('express')
const app = express()
const mongoose = require('mongoose')

mongoose.connect(process.env.DATABASE_URL, {useNewUrlParser:true})
const db = mongoose.connection
db.on("error",(e) => console.error(e))
db.once("open",() => console.log('Connected to Database'))

app.use(express.json())

const movieRouter = require('./routes/movie')
app.use('/movie',movieRouter)

app.listen(3001, () => console.log('Server started')) 