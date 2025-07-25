const express = require('express')
const Router = express.Router

const budgetApi = new Router()

const User = require('../../classes/User.cjs')

budgetApi.get('/', (req, res) => {
    let user = new User(req.query.userId)
    let budgetItems = user.budget.getItems()
    res.send(budgetItems)
})

budgetApi.get('/all', (req, res) => {
    //console.log(req.body)
})

budgetApi.post('/add', (req, res) => {
    let user = new User(req.query.userId)
    let newItem = {
        name: req.body.name,
        amount: req.body.amount,
        date: req.body.date,
        paymentsPerYear: req.body.paymentsPerYear
    }
    let newId = user.budget.addItem(newItem)
    user.save()
    res.send(newId)
})

budgetApi.post('/delete', (req, res) => {
    let itemId = req.body.id
    let user = new User(req.query.userId)
    user.budget.deleteItem(itemId)
    user.save()
    res.sendStatus(200)
})

module.exports = budgetApi