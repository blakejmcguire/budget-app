const Budget = require('./Budget.cjs')
const Cashflow = require('./Cashflow.cjs')

class User {
    constructor (userID) {
        this.userID = userID
        this.budget = new Budget(this.userID)
        this.cashflow = new Cashflow(this.userID)

        this.budget.loadData(this.userID)
        this.cashflow.loadData(this.userID)
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

    load() {
        this.budget.loadData(this.userID)
        this.budget.loadData(this.userID)
    }
}

module.exports = User