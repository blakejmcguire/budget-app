const express = require('express')
const Router = express.Router

const cashflowApi = new Router()

cashflowApi.post('/getTemp', (req, res) => {
    let from = req.query.from
    let to = req.query.to
    console.log(from, ' to ', to)
    let cashflow = req.user.budget.scheduleBetween(from, to)
    console.log(cashflow)
    res.send(cashflow)
})


cashflowApi.get('/', (req, res) => {
    console.log(User)
    let cashflowItems = user.cashflow.getItems()
    res.send(cashflowItems)
})



module.exports = cashflowApi