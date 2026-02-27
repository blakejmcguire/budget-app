const { MongoClient, ServerApiVersion } = require('mongodb')
const uri = process.env.MONGO_URI || ''
//const appName = process.env.APPLICATION_NAME || 'budget-app-dev'

class Database {
    constructor(applicationName) {
        this.appName = applicationName || 'dev'
        this.client = new MongoClient(uri, {
            serverApi: {
                version: ServerApiVersion.v1,
                strict: true,
                deprecationErrors: true,
            }
        })
    }

    connect() {
        return this.client.connect()
    }

    close() {
        return this.client.close()
    }

    test() {
        return this.client.db('admin').command({ ping: 1 })
    }

    getClient() {
        return this.client.db(this.appName)
    }
}


module.exports = Database