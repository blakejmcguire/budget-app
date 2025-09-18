const express = require('express')
const Router = express.Router

const budgetApi = new Router()

budgetApi.post('/', (req, res) => {
    let budgetItems = req.user.budget.getItems()

    budgetItems.forEach(item => {
        let date = item.nextPayment()
        date = date.toISOString().split('T')[0]
        item.nextPayment = date
    })
    res.send(budgetItems)
})

budgetApi.post('/item', (req, res) => {
    let budgetItem = req.user.budget.getItem(req.body.itemId)
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

budgetApi.post('/item/add', (req, res) => {
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

budgetApi.post('/item/edit', (req, res) => {
    let item = req.user.budget.getItem(req.body.itemId)
    
    let updatedItem = req.user.budget.editItem(item.id, {
        name: req.body.name,
        amount: req.body.amount,
        index: req.body.index,
        date: req.body.date,
        paymentsPerYear: req.body.paymentsPerYear
    })

    req.user.save()
    res.send(updatedItem)
})

budgetApi.post('/item/delete', (req, res) => {
    let budgetItem = req.user.budget.getItem(req.body.itemId)

    req.user.budget.deleteItem(budgetItem.id)
    req.user.save()
    res.sendStatus(200)
})

module.exports = budgetApi