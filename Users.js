const ObjectId = require('mongodb').ObjectId

/**
 * User schema - not final:
 * 
 * userId (set by MongoDB)
 * authId (from auth0)
 * name
 * email
 * 
 */

class Users {
    constructor(db, userId) {
        this.db = db
        this.collection = this.db.getClient().collection('users')
    }

    async createUser({data}) {
        const newUser = {
            ...data
        }
        const result = await this.collection.insertOne(newUser)
        return result.insertedId
    }

    async getUser(id) {
        let objectId = new ObjectId(id)
        const user = await this.collection.findOne({ _id: objectId })
        return user
    }

    async editUser(id, data) {
        let objectId = new ObjectId(id)
        const result = await this.collection.updateOne(
            { _id: objectId },
            { $set: data}
        )
        return result.modifiedCount > 0
    }

    async deleteUser(id) {
        let objectId = new ObjectId(id)
        const result = await this.collection.deleteOne({ _id: objectId })
        return result.deletedCount > 0
    }
}