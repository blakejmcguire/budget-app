require('dotenv').config()

const Database = require('./Database')
const Budget = require('./Budget')

const db = new Database()

async function run() {
    const test = await db.test()
    console.log(test)

    db.close()
}


run()
