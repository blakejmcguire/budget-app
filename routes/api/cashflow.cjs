const express = require('express')
const Router = express.Router

const cashflowApi = new Router()

const User = require('../../classes/User.cjs')

cashflowApi.get('/', (req, res) => {
    console.log(User)
    let cashflowItems = user.cashflow.getItems()
    res.send(cashflowItems)
})

module.exports = cashflowApi