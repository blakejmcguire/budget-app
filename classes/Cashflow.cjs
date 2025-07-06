const fs = require('fs')

const crypto = require('crypto')

class Cashflow {
    constructor(userID) {
        this.userID = userID
        this.items = []
        
        this.loadData()
    }
    
    static getFingerprint(data) {
        if(typeof data.date != 'string') {
            console.error('date for Cashflow Item hashing not valid', data)
        }
        let n = data.name.toLowerCase().replaceAll(/\s/g, '')
        let d = data.date.replaceAll(/\s|-/g, '')
        let hash = crypto.createHash('sha1')
        hash.update(n)
        hash.update(d)
        return hash.digest('hex')
    }

    loadData() {
        // Retrieve details about budgeted items from database
        try {
            let data = fs.readFileSync(`./tests/${this.userID}-Cashflow.txt`, 'utf8')
            this.items = JSON.parse(data)
        }
        catch (error) {
            if(error.code == 'ENOENT') {
                console.error('No pre-existing Cashflow data for user', this.userID)
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
            `./tests/${this.userID}-Cashflow.txt`,
            JSON.stringify(this.items),
            err => {
                if (err) {
                    console.error(err)
                }

            }
        )
    }

    addItem(data) {
        let newItem = {
            name: data.name,
            date: data.date,
            amount: data.amount,
            deleted: false,
            modified: false,
            fingerprint: Cashflow.getFingerprint(data)
        }
        
        if(this.items.find(item => (item.fingerprint == newItem.fingerprint))) {
            console.error(`Item already exists:\nname: ${newItem.name}\namount: ${newItem.amount}\ndate: ${newItem.date}\n`)
        }
        else {
            this.items.push(newItem)
        }
    }
    
    getItems() {
        return this.items
    }

}

module.exports = Cashflow