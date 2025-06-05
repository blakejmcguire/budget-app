const testData = require('../testData.js')
const fs = require('fs')

const Line = require('./Line.cjs')

class Budget {
    constructor(userID) {
        this.userID = userID
        this.items = []

        this.loadData()
    }

    getID() {
        return this.userID
    }

    loadData() {
        // Retrieve details about budgeted items from database
        try {
            let data = fs.readFileSync(`${this.userID}-Budget.txt`, 'utf8')
            let dataObj = JSON.parse(data)
            dataObj.forEach(item => {
                this.items.push(new Line({
                    name: item.name,
                    amount: item.amount,
                    paymentsPerYear: item.paymentsPerYear,
                    index: item.index
                }))
            })
        }
        catch (error) {
            if (error.code == 'ENOENT') {
                console.log('No pre-existing data for user', this.userID)
            }
            else {
                console.error(error)
            }

        }

        return
    }

    writeData() {
        // Write updateed data to the database
        fs.writeFileSync(
            `${this.userID}-Budget.txt`,
            JSON.stringify(this.items),
            err => {
                if (err) {
                    console.error(err)
                }

            }
        )
    }

    getItems() {
        return this.items
    }

    setItems(data) {
        this.items = data

        return
    }

    addItem(data) {
        let newItem = new Line(data)
        this.items.push(newItem)
    }

    scheduleBetween(fromDate, toDate) {
        let data = []
        this.items.forEach(item => {
            let dates = item.scheduleBetween(fromDate, toDate)
            dates.forEach(date => {
                data.push({
                    name: item.name,
                    amount: item.amount,
                    date: date,
                })
            })
        })
        return data
    }
}

module.exports = Budget