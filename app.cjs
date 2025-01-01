// Configure express.js

const express = require('express')
const app = express()
app.set('view engine', 'pug')
app.use(express.json())

// Set up public folder

const path = require('path')
app.use(express.static(path.join(__dirname, 'public')))
app.use(express.urlencoded({ extended: true }))

app.get('/', (req, res) => {
    res.render('index')
})

app.use('/', require('./routes/ui.cjs'))

module.exports = app