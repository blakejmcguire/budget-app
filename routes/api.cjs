const express = require('express')
const Router = express.Router

const paymentsHandler = require('../handlers/paymentsHandler.cjs')

const api = new Router()
const budgetApi = require('./api/budget.cjs')

api.get('/payments', (req, res) => {
    res.send(paymentsHandler.data)
})

api.get('/schedule', (req, res) => {
    let from = req.query.from
    let to = req.query.to

    res.send(paymentsHandler.getSchedule(paymentsHandler.data, from, to))
})

api.use('/budget', budgetApi)

module.exports = api