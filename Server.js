const Database = require('./handlers/Database')
const createApp = require('./app')

class Server {
    constructor(applicationName, port) {
        this.app = null
        this.db = null
        this.applicationName = applicationName
        this.port = port
    }

    async start() {
        try {
            this.db = new Database(this.applicationName)
            await this.db.connect()

            this.app = createApp(this.db)

            // keep a reference to the http.Server so we can close it later
            this.server = this.app.listen(this.port, () => {
                console.log(`Server is running on port ${this.port}`)
            })

            process.on('SIGINT', () => this.shutdown())
            process.on('SIGTERM', () => this.shutdown())

        } catch (error) {
            console.error('Error starting server:', error)
        }
    }

    async shutdown() {
        console.log('Shutting down server...')
        try {
            if (this.server) {
                this.server.close()
            }
            if (this.db) {
                await this.db.close()
                console.log('Database connection closed.')
            }
            console.log('Exiting process.')
            process.exit(0)
        } catch (error) {
            console.error('Error during shutdown:', error)
            process.exit(1)
        }
    }
}

module.exports = Server