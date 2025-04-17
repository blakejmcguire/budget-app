require('dotenv').config()
const { MongoClient } = require("mongodb");
const schedule = []
const user = "Blake"

class Line {
    constructor(name, date, amount) {
        this.name = name
        this.date = date
        this.amount = amount
    }

    setName(newName) {
        this.name = newName || this.name
    }

    setAmount(newAmount) {
        this.amount = newAmount || this.amount
    }

    setDate(newDate) {
        this.date = newDate || this.date
    }
}

async function saveSchedule(collection) {
    const result = await collection.replaceOne(
        {"name": user}, 
        {"name": user, "data": schedule},
        {"upsert": "true"}
    )
}

async function loadSchedule(collection) {
    schedule.length = 0
    const result = await collection.findOne({"name": user})
    result.data.forEach(datum => {
        schedule.push(new Line(datum.name, datum.date, datum.amount))
    })
    return 1
}

function addLine(name, date, amount) {
    let newLine = new Line(name, date, amount)
    schedule.push(newLine)
}

function removeLine(index) {
    schedule.splice(index, 1)
}

function editLine(index, name, date, amount) {
    schedule[index].setName(name)
    schedule[index].setDate(date)
    schedule[index].setAmount(amount)
}

async function main() {
    const uri = process.env.MONGO
    const client = new MongoClient(uri);
    const database = client.db('testApp')
    const databaseSchedule = database.collection('schedule')
    await loadSchedule(databaseSchedule)
    editLine(1, 'changedTestTwo', '2025-02-02', 1202)
    await saveSchedule(databaseSchedule)
    console.log(schedule)

    await client.close()
}
main()