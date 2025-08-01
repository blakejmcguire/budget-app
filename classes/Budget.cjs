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
            let data = fs.readFileSync(`./testData/${this.userID}-Budget.txt`, 'utf8')
            let dataObj = JSON.parse(data)
            dataObj.forEach(item => {
                this.items.push(new Line({
                    id: item.id,
                    name: item.name,
                    amount: item.amount,
                    paymentsPerYear: item.paymentsPerYear,
                    index: item.index
                }))
            })
        }
        catch (error) {
            if (error.code == 'ENOENT') {
                //console.log('No pre-existing data for user', this.userID)
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
            `./testData/${this.userID}-Budget.txt`,
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

    getItem(id) {
        let found = false
        this.items.forEach(item => {
            if(item.id == id) found = item
        })
        if(!found) throw new Error('Item not found in Budget')
        return found
    }

    setItems(data) {
        this.items = data

        return
    }

    addItem(data) {
        let newItem = new Line(data)
        let found = false

        this.items.forEach(item => {
            if(item.id == newItem.id) found = true
        })

        if(found) {
            console.log('Duplicate item, not added')
        }
        else {    
            this.items.push(newItem)
            return newItem.id
        }
    }

    editItem(id, data) {

        let item = this.getItem(id)
        
        Line.validate(data)
        
        item.name = data.name || item.name,
        item.amount = data.amount || item.amount,
        item.index = Line.getIndex(data.date) || item.index,
        item.paymentsPerYear = data.paymentsPerYear || item.paymentsPerYear

        return item
    }

    deleteItem(id) {
        try {
            let item = this.getItem(id)
            let index = this.items.indexOf(item)
            if(index > -1) {
                this.items.splice(index, 1)
            }
        }
        catch(error) {
            console.log(error)
            console.log('Item could not be deleted')
        }
        return
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