// Configure express.js

const express = require('express')
const app = express()
app.set('view engine', 'pug')

// Process request body

app.use(express.json())
app.use(express.urlencoded({ extended: true }))


// Set up public folder

const path = require('path')
app.use(express.static(path.join(__dirname, 'public')))


app.get('/', (req, res) => {
    res.render('index')
})

app.use('/', require('./routes/ui.cjs'))
app.use('/api', require('./routes/api.cjs'))

module.exports = app