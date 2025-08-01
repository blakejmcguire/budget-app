const express = require('express')
const Router = express.Router

const budgetApi = new Router()

const User = require('../../classes/User.cjs')

budgetApi.get('/:userId', (req, res) => {
    let user = new User(req.params.userId)
    let budgetItems = user.budget.getItems()
    res.send(budgetItems)
})

budgetApi.get('/:userId/:itemId', (req, res) => {
    let user = new User(req.params.userId)
    console.log(req.params.itemId)
    let budgetItem = user.budget.getItem(req.params.itemId)
    let responseObject = {
        id: budgetItem.id,
        name: budgetItem.name,
        amount: budgetItem.amount,
        paymentsPerYear: budgetItem.paymentsPerYear,
        index: budgetItem.index,
        nextPayment: budgetItem.nextPayment(new Date())
    }

    res.send(responseObject)
})

budgetApi.post('*', (req, res, next) => {
    req.user = new User(req.body.userId)
    next()
})

budgetApi.post('/add', (req, res) => {
    let newItem = {
        name: req.body.name,
        amount: req.body.amount,
        date: req.body.date,
        paymentsPerYear: req.body.paymentsPerYear
    }
    let newId = req.user.budget.addItem(newItem)
    req.user.save()
    res.send(newId)
})

budgetApi.post('/edit', (req, res) => {
    let updatedItem = req.user.budget.editItevm(req.body.itemId, {
        name: req.body.name,
        amount: req.body.amount,
        index: req.body.index,
        date: req.body.date,
        paymentsPerYear: req.body.paymentsPerYear
    })
    req.user.save()
    res.send(updatedItem)
})

budgetApi.post('/delete', (req, res) => {
    let itemId = req.body.id
    req.user.budget.deleteItem(itemId)
    req.user.save()
    res.sendStatus(200)
})

module.exports = budgetApi