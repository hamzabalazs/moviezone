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
app.use('/api',movieRouter)
const userRouter = require('./routes/user')
app.use('/api',userRouter)

app.listen(3001, () => console.log('Server started')) 