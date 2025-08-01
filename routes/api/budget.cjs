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
    let budgetItem = user.budget.getItem(req.params.itemId)
    let responseObject = {
        id: budgetItem.id,
        name: budgetItem.name,
        amount: budgetItem.amount,
        paymentsPerYear: budgetItem.paymentsPerYear,
        index: budgetItem.index,
        nextPayment: budgetItem.nextPayment(new Date()).toISOString().split('T')[0]
    }

    res.send(responseObject)
})

budgetApi.post('/:userId/add', (req, res) => {
    let user = new User(req.params.userId)
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

budgetApi.post('/:userId/:itemId/edit', (req, res) => {
    let user = new User(req.params.userId)
    let budgetItem = user.budget.getItem(req.params.itemId)
    
    let updatedItem = user.budget.editItem(budgetItem.id, {
        name: req.body.name,
        amount: req.body.amount,
        index: req.body.index,
        date: req.body.date,
        paymentsPerYear: req.body.paymentsPerYear
    })

    user.save()
    res.send(updatedItem)
})

budgetApi.post('/:userId/:itemId/delete', (req, res) => {
    let user = new User(req.params.userId)
    let budgetItem = user.budget.getItem(req.params.itemId)

    user.budget.deleteItem(budgetItem.id)
    user.save()
    res.sendStatus(200)
})

module.exports = budgetApi