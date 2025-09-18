const express = require('express')
const Router = express.Router

const ui = new Router()

ui.get('/cashflow', (req, res) => {
    res.render('cashflow')
})

ui.get('/payments', (req, res) => {
    res.render('payments')
})

ui.get('/payment/new', (req, res) => {
    res.status(501)
    res.send()
})

ui.get('/budget', (req, res) => {
    res.render('budget')
})

module.exports = ui