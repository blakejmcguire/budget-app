const testData = require('../testData.js')
const fs = require('fs')

class Budget {
    constructor(userId) {
        this.userId = userId
        this.items = {}
        this.itemsAtLoad = {}

        this.loadData()
    }

    loadData() {
        // Retrieve details about budgeted items from database
        let data = fs.readFileSync(`${this.userId}-Budget.txt`, 'utf8')
        this.items = JSON.parse(data)
        return
    }

    writeData() {
        // Write updateed data to the database
        fs.writeFileSync(
            `${this.userId}-Budget.txt`,
            JSON.stringify(this.items),
            err => {
                if(err) {
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
}

module.exports = Budget