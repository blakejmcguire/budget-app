const express = require('express')
const Router = express.Router

const User = require('../classes/User.cjs')

const paymentsHandler = require('../handlers/paymentsHandler.cjs')

const api = new Router()
const budgetApi = require('./api/budget.cjs')
const cashflowApi = require('./api/cashflow.cjs')

api.get('/payments', (req, res) => {
    res.send(paymentsHandler.data)
})

api.get('/schedule', (req, res) => {
    let from = req.query.from
    let to = req.query.to

    res.send(paymentsHandler.getSchedule(paymentsHandler.data, from, to))
})

api.post('*', (req, res, next) => {
    let userId = req.body.userId || null
    if(userId) {
        req.user = new User(userId)
    }

    next()
})

api.use('/budget', budgetApi)
api.use('/cashflow', cashflowApi)

module.exports = api