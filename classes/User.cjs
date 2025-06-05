const Budget = require('./Budget.cjs')
const Cashflow = require('./Cashflow.cjs')

class User {
    constructor (userID) {
        this.userID = userID
        this.budget = new Budget(this.userID)
        this.cashflow = new Cashflow(this.userID)
    }

    getBudget() {
        return this.budget
    }

    getCashflow() {
        return this.cashflow
    }

    save() {
        this.budget.writeData()
        this.cashflow.writeData()
    }
}

module.exports = User