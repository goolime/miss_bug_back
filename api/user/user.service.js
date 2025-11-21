//import { loggerService } from "../../services/logger.service.js";
//import { makeId, readJsonFile, writeJsonFile } from "../../services/utils.js";
import { dbService } from "../../services/db.service.js";
//import bcrypt from 'bcrypt'
import { ObjectId } from "mongodb";


export const userService = {
    query,
    getById,
    remove,
    save,
    login
}

//const users = readJsonFile('./data/users.json')
const COLLECTION_NAME = 'missBugs_users'


async function query() {

    try {
        const collection = await dbService.getCollection(COLLECTION_NAME)
        return await collection.find().toArray()
    } catch (err) {
        throw err
    }
}

async function getById(userId) {
    try {
        const collection = await dbService.getCollection(COLLECTION_NAME)
        const user = await collection.findOne({ _id: ObjectId.createFromHexString(userId) })
        return user
        /*
        const user = users.find(user => user._id === userId)
        if (!user) throw new Error('Cannot find user')
        return user
        */
    } catch (err) {
        throw err
    }
}

async function remove(userId) {
    try {
        const collection = await dbService.getCollection(COLLECTION_NAME)
        const res = await collection.deleteOne({ _id: ObjectId.createFromHexString(userId) })
        if (res.deletedCount === 0) throw new Error('Cannot delete user')

        return userId
        /*
        const userIdx = users.findIndex(user => user._id === userId)
        if (userIdx < 0) throw new Error('Cannot find user')
        users.splice(userIdx, 1)
        await _saveusersToFile()
        */
    } catch (err) {
        throw err
    }

}

async function save(userToSave) {
    try {
        if (userToSave._id) {
            /*
            const userIdx = users.findIndex(user => user._id === userToSave._id)
            if (userIdx < 0) throw new Error('Cannot find user')
            users[userIdx] = userToSave
            */
            const collection = await dbService.getCollection(COLLECTION_NAME)
            const criteria = { _id: ObjectId.createFromHexString(userToSave._id) }
            const res = await collection.replaceOne(criteria, { $set: userToSave })
            if (res.modifiedCount === 0) throw new Error('Cannot update user')
        } else {
            const collection = await dbService.getCollection(COLLECTION_NAME)
            await collection.insertOne(userToSave)
            /*
            userToSave._id = makeId()
            userToSave.password = await bcrypt.hash(userToSave.password, 10)
            users.push(userToSave)
            */
        }
        /*
        await _saveusersToFile()
        return userToSave
        */
        return userToSave
    } catch (err) {
        throw err
    }
}

async function login(username, password) {
    try {
        const criteria = { username }
        /*
        criteria.password = await bcrypt.hash(userToSave.password, 10)
        */
        const collection = await dbService.getCollection(COLLECTION_NAME)
        const user = await collection.findOne(criteria)
        if (!user) throw new Error('Invalid username or password')
        return user
        /*
        const user = users.find(user => user.username === username)
        if (!user) throw new Error('Invalid username')
        const match = await bcrypt.compare(password, user.password)
        if (!match) throw new Error('Invalid password')
        return user
        */
    } catch (err) {
        throw err
    }
}

/*
function _saveusersToFile() {
    return writeJsonFile('./data/users.json', users)
}
*/  