require('dotenv').config()
const Server = require('./Server.js')

const applicationName = process.env.APPLICATION_NAME || 'budget-app-dev'
const port = process.env.PORT || 3000

const server = new Server(applicationName, port)

(async () => {
    await server.start().catch(error => {
        console.error('Error starting server:', error)
        process.exit(1)
    })
})()
