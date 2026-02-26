require('dotenv').config()

const Database = require('./handlers/Database')
const Budget = require('./handlers/Budget')

const db = new Database()

async function run() {
    const test = await db.test()
    console.log(test)

    db.close()
}


run()
