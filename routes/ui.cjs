const express = require('express')
const Router = express.Router

const ui = new Router()

ui.get('/cashflow', (req, res) => {
    res.status(501)
    res.send()
})

ui.get('/payment/new', (req, res) => {
    res.status(501)
    res.send()
})

module.exports = ui