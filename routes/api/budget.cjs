const express = require('express')
const Router = express.Router

const budgetApi = new Router()

const User = require('../../classes/User.cjs')

budgetApi.get('/', (req, res) => {
    console.log(req.query)
    let user = new User(req.query.userId)
    let budgetItems = user.budget.getItems()
    res.send(budgetItems)
})

budgetApi.get('/all', (req, res) => {
    //console.log(req.body)
})

module.exports = budgetApi