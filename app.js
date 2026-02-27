const express = require('express')

const User = require('./handlers/User.js')
const Budget = require('./handlers/Budget.js')

function createApp(db) {
    const app = express()
    app.use(express.json())

    app.get('/', (req, res) => {
        res.send('Hello')
    })

    return app
}

module.exports = createApp